/*eslint no-sync: "off"*/

"use strict";

var cfg = require("../lib/config.js"),
  path = require("path"),
  basename = path.basename(__filename, ".js"),
  debug = require("debug")("ezmaster:" + basename),
  moment = require("moment"),
  async = require("async"),
  fs = require("fs"),
  getSize = require("get-folder-size"),
  glob = require("glob"),
  docker = require("./docker.js").docker,
  sortBy = require("sort-by"),
  _ = require("lodash"),
  exec = require("child_process").exec,
  apps = require("./app");

// Cache explanations:
// We store the instances in a cache to avoid doing too much slow "docker ps"
// When an action is performed in route.js (start, stop, delete, update config, add instance),
// we call refreshInstances() which call getInstances(true)
var cacheInstances = null;

/**
 * Returns the technicalName list coresponding to the ezmaster's handled instances
 * return example:
 * [ 'tech-name-1', 'ezvis-demo', 'istex-ark-2' ]
 */
module.exports.getInstancesManifests = function(cb) {
  // Read the content of manifests folders in order to
  // extract the instances technicalName and some metadata.
  var manifestPath = cfg.dataManifestsPath + "/*.json";
  glob(manifestPath, function(err, files) {
    if (err) {
      debug("Cannot read the folder, something goes wrong with glob", err);
      return cb(err);
    }

    // If no files then return an empty array.
    if (files.length === 0) {
      return cb(null, {});
    }

    var manifests = {};
    files.forEach(function(file) {
      // Extract the technicalName from the filename and read
      // the manifest content to get other metadata.
      // NOTA : filename example : 'manifests/myprj-mystudy-5.json'
      //         then technicalName will be 'myprj-mystudy-5'.
      var technicalName = _.last(file.slice(0, -5).split("/"));
      debug(
        "Reading manifest: " + file + " -> technicalName: " + technicalName
      );
      fs.readFile(file, "utf8", function(err, manifestContent) {
        if (err) {
          debug(
            "Cannot read the file, something goes wrong with the file",
            err
          );
          return cb(err);
        }

        try {
          var manifest = JSON.parse(manifestContent);
          manifests[technicalName] = manifest;

          // default value
          if (manifests[technicalName].technicalInstance === undefined) {
            manifests[technicalName].technicalInstance = false;
          }
        } catch (err) {
          debug("Error reading manifest: " + file + " [" + err + "]");
        }

        // Return the manifests when the
        // last file is handled.
        if (Object.keys(manifests).length == files.length) {
          return cb(null, manifests);
        }
      });
    });
  });
};

/**
 * Returns the instances list
 * return example:
 *  { 'test-fakeapp': {
 *      technicalName: 'test-fakeapp',
 *      containerId: '5e338b98a6ecd910b20efa282e1ead07f06af5673ddb4b525d4551d699b4be47',
 *      dataPath: '/home/kerphi/ezmaster/instances/test-fakeapp/data/',
 *      creationDate: '2016/09/08 14:20:11',
 *      app: 'fakeapp',
 *      running: true,
 *      port: 49152,
 *      publicURL: 'http://127.0.0.1:49152',
 *      target: 'test-fakeapp',
 *      longName: 'fakeapp'
 *    }
 *  }
 */
module.exports.getInstances = function(cb) {
  // If we have to get the list and update the cache.
  if (cacheInstances) {
    return cb(null, cacheInstances);
  }

  async.parallel(
    [
      // Retrieves all instances manifests from the files.
      function(handleManifests) {
        module.exports.getInstancesManifests(function(err, manifests) {
          // just reformat the results (this could be avoided with a refactoring bellow)
          var results = [];
          Object.keys(manifests).forEach(function(technicalName) {
            results.push(
              Object.assign(manifests[technicalName], {
                technicalName: technicalName
              })
            );
          });
          return handleManifests(err, results);
        });
      },

      // Retrieves the instances docker informations.
      // Ex :
      // - technicalName: 'article-type-4',
      // - containerId: '1e254654654465446545465465456465465',
      // - dataPath: '/applis/lodex/home/instances/article-type-4'
      // - creationDate: '2016/03/17',
      // - port: 35284,
      // - app: 'inistcnrs/lodex:2.0.1',
      // - running: true
      function(handleDockerInstances) {
        docker.listContainers({ all: true }, function(err, containers) {
          if (err) {
            return handleDockerInstances(err);
          }

          var dockerInstances = [];
          containers.forEach(function(data) {
            if (!data.Labels.ezmasterInstance) {
              return; // skip if it's not an ezmaster instance
            }

            var instance = {};

            // Example of data.Names[0] : /myprj-mystudy-5
            instance.technicalName = data.Names[0].split("/")[1];
            instance.containerId = data.Id;
            instance.dataPath =
              process.env.EZMASTER_PATH +
              "/data/instances/" +
              instance.technicalName +
              "/data/";
            instance.creationDate = moment
              .unix(data.Created)
              .format("YYYY/MM/DD HH:mm:ss");
            instance.app = data.Image;

            if (data.State === "running") {
              instance.running = true;

              // search the correct PublicPort port mapped to the internal one
              // Example of data in data.Ports:
              // [ { PrivatePort: 59599, Type: 'tcp' },
              //   { IP: '0.0.0.0', PrivatePort: 3000, PublicPort: 32769, Type: 'tcp' } ]
              // we have to take the one having a PublicPort
              var portToHandle = data.Ports.filter(function(elt) {
                return elt.PublicPort !== undefined;
              });

              if (portToHandle.length > 0 && portToHandle[0].PublicPort) {
                instance.port = portToHandle[0].PublicPort;
                instance.publicURL =
                  "http://" +
                  process.env.EZMASTER_PUBLIC_IP +
                  ":" +
                  instance.port;
                if (!process.env.EZMASTER_PUBLIC_IP) {
                  instance.publicURL = "http://127.0.0.1:" + instance.port;
                }
              } else {
                instance.publicURL = "";
              }

              instance.target = data.Names[0].split("/")[1];
            } else if (data.State === "exited") {
              instance.running = false;
              instance.port = [];
              instance.publicURL = "";
              instance.target = "";
            }

            dockerInstances.push(instance);
          });

          // Sort dockerInstances by creationDate.
          // Aim : conserve same order while displaying instances on the client.
          // The '-' means that we want a reversed order.
          dockerInstances.sort(sortBy("-creationDate"));

          // finally calculates the instance folder size
          async.map(
            dockerInstances,
            function(instance, cbInstanceSize) {
              var instanceRootPath =
                cfg.dataInstancesPath + "/" + instance.technicalName + "/";
              getSize(instanceRootPath, function(err, size) {
                if (err) {
                  instance.rawSize = 0;
                } else {
                  instance.rawSize = size;
                }
                return cbInstanceSize(null, instance);
              });
            },
            handleDockerInstances
          );
        });
      }
    ],
    function(err, results) {
      if (err) {
        return cb(err);
      }
      // Retrieves results from the two callbacks (manifests files and docker metadata)
      // and ignores docker containers not listed in the manifests ("unknown technicalName").
      // Example: ezmaster itself or ezmaster_db
      // or any other container currently running on the machine.
      var instances = {};
      results[1].forEach(function(dockerInstance) {
        results[0].forEach(function(manifest) {
          if (manifest.technicalName === dockerInstance.technicalName) {
            instances[manifest.technicalName] = _.assign(
              dockerInstance,
              manifest
            );
          }
        });
      });

      // Nullify dataPath if /etc/ezmaster.json in the container does not exist
      // or does not have a dataPath (not useful)
      async.each(
        Object.keys(instances),
        (technicalName, cbDataPath) => {
          apps.readEzmasterAppConfig(
            instances[technicalName].app,
            (err, config) => {
              instances[technicalName].dataPath = config.dataPath
                ? instances[technicalName].dataPath
                : "";
              return cbDataPath(null);
            }
          );
        },
        err => {
          // cacheInstances update the instances list.
          cacheInstances = instances;

          // Return the just get instances list.
          return cb(null, instances);
        }
      );
    }
  );
};

// This function refreshes the instances list on table.js component.
// Done by sending the instances list with socket to the component table.js.
// The component table.js is listening to messages coming from here.
module.exports.refreshInstances = function() {
  // Get the socket.io socket
  var socket = cfg.socket;

  // clear the cache before geting the new list
  cacheInstances = null;

  // true for instancesChangesBool because we need to update the cache and
  // get the new instances list.
  module.exports.getInstances(function(err, instancesList) {
    if (err) {
      return new Error(err);
    }

    // Broadcast to all clients this new version to :
    //  - update the 'containers' variable
    //  - refresh the table.js component
    // This is the table.js component which receives the emit message.
    // If the socket variable is defined, we broadcast.
    socket && socket.broadcast.emit("refreshInstances", instancesList);

    // For Local Tests.
    socket && socket.emit("refreshInstances", instancesList);
  });
};

/**
 * Returns the internal ip of the wanted instance
 * (used for unittests)
 */
module.exports.getInstanceInternalIp = function(techName, cb) {
  var cmd =
    "docker inspect " +
    '--format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ' +
    techName;
  exec(cmd, function(err, stdout, stderr) {
    cb(err, ("" + stdout).trim());
  });
};

/**
 * Initialize an instance with the original
 * data coming from the application
 */
module.exports.initConfigAndData = function(params, cb) {
  module.exports.initConfig(params, function(err) {
    if (err) return cb(err);
    debug("Instance initConfigAndData: initConfig done");
    module.exports.initData(params, function(err) {
      debug("Instance initConfigAndData: initData done", err);
      return cb(err);
    });
  });
};
module.exports.initConfig = function(params, cb) {
  // check the config file exists before doing anything
  exec(
    'docker run --rm --entrypoint "/bin/ls" ' +
      params.appSrc +
      " " +
      params.appConfig.configPath,
    function(err, stdout, stderr) {
      // config file does not exists, skip this step
      if (err) return cb(null);

      // config file exists so copy the config file
      exec(
        'docker run --rm --entrypoint "/bin/cat" ' +
          params.appSrc +
          " " +
          params.appConfig.configPath +
          " > config/config.raw",
        {
          cwd: cfg.dataInstancesPath + "/" + params.instanceDst
        },
        function(err, stdout, stderr) {
          return cb(err);
        }
      );
    }
  );
};
module.exports.initData = function(params, cb) {
  // check the data folder is not empty before doing anything
  if (!params.appConfig.dataPath) return cb(null);
  let cmd =
    'docker run --rm --entrypoint "/bin/ls" ' +
    params.appSrc +
    " " +
    params.appConfig.dataPath;
  debug("Instance initData1: ", cmd);
  exec(cmd, function(err, stdout, stderr) {
    // data folder is empty or doesnot exists, skip this step
    if (err || stdout == "") return cb(null);

    // then thanks to tar commande, copy the data folder content into the instance initial state
    // example:
    // docker run --rm -w /blog/source/_posts --entrypoint "/bin/tar" \
    //  inistcnrs/ezmaster-hexo:latest cf - \ -C /blog/source/_posts . | tar vxf -
    let cmd =
      'docker run --rm --entrypoint "/bin/tar" ' +
      params.appSrc +
      " cf - -C " +
      params.appConfig.dataPath +
      " . | tar vxf -";
    debug("Instance initData2: ", cmd);
    exec(
      cmd,
      {
        cwd: cfg.dataInstancesPath + "/" + params.instanceDst + "/data/"
      },
      function(err, stdout, stderr) {
        return cb(err);
      }
    );
  });
};

module.exports.cleanup = function(params, cb) {
  // check the data folder is not empty before doing anything
  debug("cleanup params", params);
  if (!params.appConfig.cleanupScript) {
    return cb(null);
  }
  exec(
    "docker exec " +
      params.containerId +
      " " +
      params.appConfig.cleanupScript +
      "",
    function(err, stdout, stderr) {
      debug("cleanup output", stdout, stderr);
      if (err) {
        return cb(err);
      }
      return cb(null);
    }
  );
};

module.exports.checkInstance = function(containerId, cb) {
  var container = docker.getContainer(containerId);
  container.inspect(function(err, data) {
    if (err) {
      return cb(err);
    }
    module.exports.getInstancesManifests(function(err, manifests) {
      var manifest = manifests[data.Name.slice(1)];

      if (manifest === undefined) {
        return cb(
          new Error(
            "No manifest for the given container ID (" +
              data.Name.slice(1) +
              ")"
          )
        );
      }

      cb(null, container, data, manifest);
    });
  });
};

/**
 * Generates all the Nginx instances config and alias instances config
 * this function is called every time a new instance is created (see docker-websocket.js)
 */
module.exports.generateAllRPNginxConfig = function(cb) {
  let self = this;
  debug("generateAllRPNginxConfig started");
  // cleanup the Nginx conf
  self.cleanupAllRPNginxConfig(function(err) {
    if (err) {
      debug("generateAllRPNginxConfig finished", err);
      return cb && cb(err);
    }

    // then create the ezmaster public access nginx config
    self.createEzMasterPublicRPNginxConfig(function(err) {
      if (err) {
        debug("createEzMasterPublicRPNginxConfig error", err);
        return cb && cb(err);
      }

      // then create all the nginx config for every ezmaster instances
      self.getInstances(function(err, instances) {
        if (err) {
          debug("generateAllRPNginxConfig finished", err);
          return cb && cb(err);
        }

        // sort the instances by number in order to
        // implement the reverse proxy aliase feature
        // Input example, Object.keys(instances) looks like :
        //   [ 'a-b-5', 'o-p-6', 'a-b-3', 'o-p-8', 'a-b', 'o-p-4', 'a-b-4' ]
        // orderedTechnicalNames output will be :
        //   [ 'a-b-3', 'a-b-4', 'a-b-5', 'o-p-4', 'o-p-6', 'o-p-8', 'a-b' ]
        const orderedTechnicalNames = Object.keys(instances)
          .sort(function(item1, item2) {
            item1 = item1.split("-");
            item2 = item2.split("-");
            if (item1.length <= 2 || item2.length <= 2) return 1;
            if (item1[0] === item2[0] && item1[1] === item2[1]) {
              return parseInt(item1[2]) < parseInt(item2[2]) ? 1 : -1;
            }
            return 1;
          })
          .reverse();

        // generate all the instances reverseproxy configurations (nginx)
        async.eachSeries(
          orderedTechnicalNames,
          (oneTechnicalName, cbNext) => {
            // do not generate config for none running instances
            if (!instances[oneTechnicalName].running) return cbNext(null);
            self.createRPNginxConfig(
              oneTechnicalName,
              instances[oneTechnicalName].httpPort,
              true,
              cbNext
            );
          },
          err => {
            if (err) {
              debug("generateAllRPNginxConfig finished", err);
              return cb && cb(err);
            }
            // then reload ngnix and returns success
            return self.reloadNginxRP(function(err) {
              debug("generateAllRPNginxConfig finished", err);
              return cb && cb(err);
            });
          }
        );
      });
    }); // createEzMasterPublicRPNginxConfig
  }); // cleanupAllRPNginxConfig
};

/**
 * Generates the raw nginx config file
 * it uses technicalName and httpPort parameters to instanciate from a config template
 * if createAlias is true, it also creates the alias config of the instance ex:
 * techName = "my-blog-4" ==> techNameAlias = "my-blog"
 */
module.exports.createRPNginxConfig = function(
  technicalName,
  httpPort,
  createAlias,
  cb
) {
  const serverName =
    technicalName + (cfg.publicDomain ? "." + cfg.publicDomain : "");
  let cmd =
    "cat /etc/nginx/conf.d/ezmaster-instance-nginx.conf.tpl | " +
    'sed "s#EZMASTER_RP_INSTANCE_SERVER_NAME#' +
    serverName +
    '#g" | ' +
    'sed "s#EZMASTER_RP_INSTANCE_HOST#' +
    technicalName +
    '#g" | ' +
    'sed "s#EZMASTER_RP_INSTANCE_PORT#' +
    httpPort +
    '#g" ' +
    "> /etc/nginx/conf.d/" +
    technicalName +
    ".conf";

  if (createAlias && technicalName.split("-").length > 2) {
    const technicalNameAlias =
      technicalName.split("-")[0] + "-" + technicalName.split("-")[1];
    const serverNameAlias =
      technicalNameAlias + (cfg.publicDomain ? "." + cfg.publicDomain : "");
    cmd +=
      " ; " +
      "cat /etc/nginx/conf.d/ezmaster-instance-nginx.conf.tpl | " +
      'sed "s#EZMASTER_RP_INSTANCE_SERVER_NAME#' +
      serverNameAlias +
      '#g" | ' +
      'sed "s#EZMASTER_RP_INSTANCE_HOST#' +
      technicalName +
      '#g" | ' +
      'sed "s#EZMASTER_RP_INSTANCE_PORT#' +
      httpPort +
      '#g" ' +
      "> /etc/nginx/conf.d/" +
      technicalNameAlias +
      ".conf";
  }

  debug("createRPNginxConfig", cmd);

  exec(cmd, function(err, stdout, stderr) {
    if (err) return cb(err);
    return cb(null);
  });
};

/**
 * Generates the ezmaster (front and webdav) public access nginx config file if necessary
 */
module.exports.createEzMasterPublicRPNginxConfig = function(cb) {
  // skip ezmaster public access reverse proxy creation
  // if no password or no public domain
  if (!cfg.publicDomain || !cfg.EZMASTER_USER || !cfg.EZMASTER_PASSWORD) {
    debug("createEzMasterPublicRPNginxConfig skipped");
    return cb(null);
  }

  let cmd =
    "cat /etc/nginx/conf.d/ezmaster-front-nginx.conf.tpl | " +
    'sed "s#EZMASTER_PUBLIC_DOMAIN#' +
    cfg.publicDomain +
    '#g" ' +
    "> /etc/nginx/conf.d/ezmaster-front.conf";
  cmd +=
    " ; cat /etc/nginx/conf.d/ezmaster-webdav-nginx.conf.tpl | " +
    'sed "s#EZMASTER_PUBLIC_DOMAIN#' +
    cfg.publicDomain +
    '#g" ' +
    "> /etc/nginx/conf.d/ezmaster-webdav.conf";

  debug("createEzMasterPublicRPNginxConfig", cmd);

  exec(cmd, function(err, stdout, stderr) {
    if (err) return cb(err);
    return cb(null);
  });
};

/**
 * Remove all the nginx config
 */
module.exports.cleanupAllRPNginxConfig = function(cb) {
  let cmd = "rm -f /etc/nginx/conf.d/*.conf";
  exec(cmd, function(err, stdout, stderr) {
    if (err) return cb(err);
    return cb(null);
  });
};

/**
 * Reload nginx daemon (it will take into account all the config)
 */
module.exports.reloadNginxRP = function(cb) {
  let cmd = "docker exec ezmaster-rp /etc/init.d/nginx reload";
  exec(cmd, function(err, stdout, stderr) {
    if (err) return cb(err);
    return cb(null);
  });
};
