/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , getSize = require('get-folder-size')
  , filesize = require('filesize')
  , docker = require('../lib/docker.js').docker
  , exec = require('child_process').exec
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , fileExists = require('file-exists')
  , instances = require('../lib/instances.js')
  , app = require('../lib/app.js')
  , instancesArray
  , containers
  , portMax
  , freePortSplitted
  , mmm = require('mmmagic')
  , Magic = mmm.Magic
  , multer = require('multer')
  , udisk = require('../lib/diskusage.js')
  , stripAnsi = require('strip-ansi')
  ;


var express = require('express');
var router = express.Router();

/**
 * Returns the instance list
 */
router.route('/')
.get(function (req, res, next) {

  instances.getInstances(function (err, data) {
    if (err) { return next(err); }
    return res.status(200).send(data);
  });

});

/**
 * Start an instance
 */
router.route('/start/:containerId')
.put(bodyParser(), function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) { return next(err); }

    container.start(function (err, datas, container) {
      if (err) { return next(err); }

      // When an instance is started, we call refreshInstances() to update
      // the instances list cache and socket emit the updated list to all users.
      instances.refreshInstances();

      res.status(200).send('Starting done');

    });

  });
});



/**
 * Stop an instance
 */
router
.route('/stop/:containerId')
.put(bodyParser(), function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) { return next(err); }

    instances.getInstancesManifests(function(err, manifests) {
      var manifest = manifests[data.Name.slice(1)];

      if (manifest === undefined) {
        return next(
          new Error('No manifest for the given container ID (' + data.Name.slice(1) + ')')
        );
      }

      container.stop(function (err, datas, container) {
        if (err) { return next(err); }

        // When an instance is stopped, we call refreshInstances() to update the
        // instances list cache and socket emit the updated list to all users.
        instances.refreshInstances();

        res.status(200).send('Stoping done');
      });
    });

  });
});



/**
 * Update a config.raw of a specific instance
 */
router
.route('/config/:containerId')
.put(bodyParser({ limit: '100mb' }), function (req, res, next) {
  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) { return next(err); }

    var splittedName = data.Name.split('/');

    var newConfig = typeof req.body.newConfig === 'object' ?
      JSON.stringify(req.body.newConfig, null, 2) :
      req.body.newConfig;
    debug('Update config for', splittedName[1], newConfig);

    fs.writeFile(
      cfg.dataInstancesPath + '/' + splittedName[1] + '/config/config.raw',
      newConfig, function (err) {

        if (err) { return next(err); }

        if (data.State.Running == true) {
          container.restart(function (err) {
            if (err) { return next(err); }
            res.status(200).send('Update done');
          });
        }
        else {
          res.status(200).send('Update done');
        }
      }
    );

    // When a new config is given to an instance, we call refreshInstances() to update the
    // instances list cache and socket emit the updated list to all users.
    instances.refreshInstances();

  });
});


/**
 * Check whether one instance exists or not from its passed technicalName
 * Returns OK when the manifest does not yet exist
 * Returns KO when the manifest already exist
 */
router
.route('/verif/:technicalName')
.get(bodyParser(), function (req, res, next) {

  instances.getInstances(function (err, instances) {
    if (err) return res.status(500).send(new Error(err));

    return res.status(200).send(
      Object.keys(instances).indexOf(req.params.technicalName) !== -1 ? 'KO' : 'OK'
    );
  });

});


/**
 * Retrieve the config of the given instance
 */
router
.route('/:containerId')
.get(bodyParser(), function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) { return next(err); }

    var splittedName = data.Name.split('/');

    // Get Delete Information.
    var directoryDatas = cfg.dataInstancesPath + '/' + splittedName[1] + '/data/'
      , result = {};

    getSize(directoryDatas, function (err, size) {

      if (err) { return next(err); }

      result.technicalName = splittedName[1];
      result.size = filesize(size);

      // Get Configuration Information.
      var configRawPath = cfg.dataInstancesPath + '/' + splittedName[1] + '/config/config.raw';
      fs.stat(configRawPath, function (err, stat) {
        if (err) {
          configRawPath = cfg.dataInstancesPath + '/' + splittedName[1] + '/config/config.json';
        }
        fs.readFile(configRawPath, function (err, obj) {
          if (err) { return next(err); }
          result.config = '' + obj;
          return res.status(200).send(result);
        });
      });

    });

  });

});



router
.route('/:containerId')
.delete(function (req, res, next) {
  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) {
      return next(err);
    }

    instances.cleanup({
      containerId : req.params.containerId,
      appConfig: {
        cleanupScript : manifest.cleanupScript
      }
    }, function (err) {
      if (err) {
        return next(err);
      }
      removeContainer(data.State.Running);
    });

    function removeContainer (containerStatus) {
      if (containerStatus == true) {
        container.stop(function (err, datas, cont) {
          if (err) { return next(err); }

          container.remove(function (err, datas, cont) {
            if (err) { return next(err); }

          });
        });
      }
      else if (containerStatus == false) {
        container.remove(function (err, datas, cont) {
          if (err) { return next(err); }
        });
      }

      removeManifest(data.Name);
    }

    function removeManifest (containerName) {

      var splittedName = containerName.split('/');
      rimraf(cfg.dataInstancesPath + '/' + splittedName[1], function (err) {
        if (err) { return next(err); }

        rimraf(cfg.dataManifestsPath + '/' + splittedName[1] + '.json', function (err) {
          if (err) { return next(err); }

          // When an instance is deleted, we call refreshInstances() to update the
          // instances list cache and socket emit the updated list to all users.
          instances.refreshInstances();

          res.status(200).send('Removing done');
        });
      });
    }

  });

});

/**
 * Route to create a new instance
 */
router
.route('')
.post(bodyParser(), function (req, res, next) {

  var technicalName = req.body.technicalName
    , longName = req.body.longName
    , image = req.body.app
    , project = req.body.project
    , study = req.body.study
    , version = req.body.version
    ;
  debug('Creating an instance:', technicalName, longName, image);

  if (/^[a-z0-9]+$/.test(project) == false && project != '' && project != null) {
    return res.status(400).send('Enter a valid project name');
  }

  if (/^[a-z0-9]+$/.test(study) == false && study != '' && study != null) {
    return res.status(400).send('Enter a valid study name');
  }

  if (/^[0-9]*$/.test(version) === false) {
    return res.status(400).send('Enter a valid version number');
  }

  if (fileExists(cfg.dataManifestsPath + '/' + req.query.technicalName + '.json') == true) {
    res.status(409).send('Technical name already exists');
  } else {

    udisk(function (err, info) {
      if (err) {
        return res.status(500).send(new Error(err));
      }
      if (info.fsIsAlmostFilled) {
        return res.status(500)
        .send('No space left in the file system. Cannot create a new instance.');
      }

      // space disk check ok, start creating the instance
      mkdirp(cfg.dataInstancesPath + '/' + technicalName + '/config/', makeDataDirectory);
    });
  }


  function makeDataDirectory(err) {
    if (err) { return next(err); }
    debug('Creating an instance: makeDataDirectory', technicalName);

    mkdirp(cfg.dataInstancesPath + '/' + technicalName + '/data/', chmodDataDirectory);
  }

  function chmodDataDirectory(err) {
    if (err) { return next(err); }
    debug('Creating an instance: chmodDataDirectory', technicalName);

    fs.chmod(cfg.dataInstancesPath + '/' + technicalName + '/data/', 0o777, createConfigFile);
  }

  function createConfigFile(err) {
    if (err) { return next(err); }
    debug('Creating an instance: createConfigFile', technicalName);
    fs.appendFile(cfg.dataInstancesPath + '/' + technicalName + '/config/config.raw',
      '{}',
      readInstances
    );
  }


  function readInstances(err) {
    if (err) { return next(err); }
    debug('Creating an instance: readInstances', technicalName);

    instancesArray = fs.readdirSync(cfg.dataInstancesPath);

    docker.listContainers({all : true}, createInstance);
  }


  function createInstance(err, containersList) {
    if (err) { return next(err); }
    debug('Creating an instance: createInstance', technicalName);

    containers = containersList;

    portMax = 0;
    freePortSplitted = cfg.freePortRange.split('-');

    checkContainer();
  }

  function checkContainer() {
    var element = containers.pop();
    debug('Creating an instance: checkContainer', element && element.Names[0], technicalName);

    if (element) {
      var splittedName = element.Names[0].split('/');
      if (instancesArray.indexOf(splittedName[1]) === -1) {
        return checkContainer();
      }

      var container = docker.getContainer(element.Id);

      container.inspect(checkPort);
    }
    else {
      if (!Number.isInteger(portMax) || portMax == 0) {
        portMax = freePortSplitted[0];
      }

      // reads from the image where is located the port, config and data
      // ex: {
      //   port: 3333,
      //   config: '/myapp/config.json',
      //   data: /myapp/data/
      // }
      app.readEzmasterAppConfig(image, function (err, appConfig) {
        debug('Creating an instance: readEzmasterAppConfig', appConfig, technicalName);

        appConfig.longName = longName;

        instances.initConfigAndData({
          instanceDst: technicalName,
          appSrc: image,
          appConfig: appConfig }, function (err) {
          if (err) return next(err);
          debug('Creating an instance: initConfigAndData done', technicalName);

          var publicDomain = cfg.publicDomain;
          var publicUrl;
          if (publicDomain) {
            publicUrl = 'http://' + technicalName + '.' + publicDomain;
          } else {
            publicUrl = 'http://'
            + process.env.EZMASTER_PUBLIC_IP + ':' + appConfig.httpPort;
            if (!process.env.EZMASTER_PUBLIC_IP) {
              publicUrl = 'http://127.0.0.1:' + appConfig.httpPort;
            }
          }

          // prepare the command line to create and run the instance
          var cmd = 'docker run -dt -p ' + portMax + ':' + appConfig.httpPort+ ' '
          + '-e http_proxy -e https_proxy -e no_proxy -e EZMASTER_MONGODB_HOST_PORT '
          // Restart the instance unless it is explicitly stopped by ezmaster
          // https://docs.docker.com/engine/admin/start-containers-automatically/
          + (process.env.NODE_ENV === 'production' ? '--restart unless-stopped ' : '')
          + '-e EZMASTER_TECHNICAL_NAME="' + technicalName + '" '
          // eslint-disable-next-line quotes
          + '-e EZMASTER_LONG_NAME="' + longName.replace('"', "\\\"") + '" '
          + '-e EZMASTER_APPLICATION="' + image + '" '
          + '-e DEBUG '
          + '-e EZMASTER_PUBLIC_URL="' + publicUrl + '" '
          + '--net=ezmaster_eznetwork --link ezmaster_db --link ezmaster-api '
          + '-v ' + process.env.EZMASTER_PATH + '/data/instances/'
          + technicalName + '/config/config.raw:' + appConfig.configPath + ' '
          + (appConfig.dataPath ? '-v ' + process.env.EZMASTER_PATH + '/data/instances/'
            + technicalName + '/data/:' + appConfig.dataPath + ' ' : '')
          + '--label ezmasterInstance=1 ' // tells it's an instance for docker events listening
          + '--name ' + technicalName + ' ' + image;

          debug('Creating an instance: ', cmd);

          // store some extra things into manifest
          // useful for future upgrading stuff
          appConfig.dockerCmdForCreation       = cmd;
          appConfig.ezmasterVersionForCreation = cfg.package.version;

          // creates the instance manifest
          fs.writeFile(
            cfg.dataManifestsPath + '/' + technicalName + '.json',
            JSON.stringify(appConfig, null, 2),
            function (err) {
              if (err) { return next(err); }
              instances.refreshInstances();

              // and execute the docker run !
              exec(cmd, function (err, stdout, stderr) {
                if (err) { return next(err); }
                fs.chmod(cfg.dataInstancesPath + '/' + technicalName + '/data/', 0o777, function() {
                  return res.status(200).send('Instance technicalName created');
                });
              });
            }
          );


        });
      });

    }
  }


  function checkPort(err, data) {
    if (err) { return next(err); }

    var keys =  Object.keys(data.HostConfig.PortBindings);
    var currentPort = data.HostConfig.PortBindings[keys[0]][0].HostPort;

    if (currentPort >= portMax) {
      portMax = parseInt(currentPort) + 1;
    }

    return checkContainer();
  }


}); // End of the route.



/**
 * Route to upload a file directly from the html upload form.
 */
router
.route('/:containerId/data/')
.post(bodyParser(), function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) { return next(err); }



    // Get freeDisk space.
    udisk(function(err, info) {

      if (err) { return next(err); }

      // Split the instance name.
      var splittedName = data.Name.split('/');

      // We use multer to pass data from the input type file to this route file.
      // Multer is coupled with bodyparser because it can't manage input type file alone anymore.
      var storage = multer.diskStorage({
        destination: function (req, file, callback) {
          // We save the file in the correct folder.
          // splittedName[1] is the instance technical name.
          callback(null, cfg.dataInstancesPath + '/' + splittedName[1] + '/data');
        },
        filename: function (req, file, callback) {
          // We upload the file with its original name.
          callback(null, file.originalname);
        }
      });

      // .any() allows any file.
      // limits : the user can't upload a file which size is greater than capSize.
      var upload = multer({
        storage : storage,
        limits: { fileSize: info.maxFileCapSize }
      }).any();

      upload(req, res, function(err) {
        if (err) {
          return res.end('Error uploading file.');
        }

        res.end('File is uploaded');
      });

    });
  });
});


router
.route('/:containerId/data/:filename')
.get(function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) { return next(err); }

    // Split the instance name.
    var splittedName = data.Name.split('/');

    // The path to the data folder.
    // splittedName[1] is the instance technical name.
    var dir = cfg.dataInstancesPath + '/' + splittedName[1] + '/data';

    res.sendFile(req.params.filename, {
      root : dir,
      dotfiles : 'deny',
      maxAge: 10000
    });

  });

});

/**
 * Route to get information on the data files from a specific instance.
 */
router
.route('/:containerId/data')
.get(function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {


    if (err) { return next(err); }

    // Split the instance name.
    var splittedName = data.Name.split('/');

    // The path to the data folder.
    // splittedName[1] is the instance technical name.
    var dir = cfg.dataInstancesPath + '/' + splittedName[1] + '/data';

    // The object we will return which contains the information.
    var results = {};

    // Get the number of files in the data folder of the instance.
    var nbFiles = fs.readdirSync(dir).length;

    // If there are no files in the data folder, we just return results as an empty object.
    if (nbFiles == 0) {
      return res.status(200).send(results);
    }

    // For each file in the data folder :
    // - We get information on it.
    // - We store them into result.
    // - We eventually store result into results.
    // - We return results.
    fs.readdirSync(dir).forEach(function(file) {

      // fs.stat to get some information on the file.
      fs.stat(dir+'/'+file, function(err, stat) {

        if (err) { return next(err); }

        // The Magic module allows to get the file Mime type.
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(dir+'/'+file, handleFileMimeType);
        function handleFileMimeType(err, resu) {
          if (err) return res.status(500).send(err);

          nbFiles--;

          var result = {};
          result.name = file;
          result.size = filesize(stat.size);
          result.mimeType = resu;
          results[result.name] = result;

          if (nbFiles == 0) {
            return res.status(200).send(results);
          }
        }


      });

    });

  });

});



// Route to delete a specific data file from a specific instance data folder.
router
.route('/:containerId/:fileName')
.delete(function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) {
      return next(err);
    }

    // Split the instance name.
    var splittedName = data.Name.split('/');

    // Delete the file.
    // splittedName[1] is the instance technical name.
    rimraf(cfg.dataInstancesPath + '/' + splittedName[1] + '/data/' + req.params.fileName,
      function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).send('Data File Deleted.');
      }
    );
  });
});


router
.route('/:containerId/logs')
.get(function (req, res, next) {

  instances.checkInstance(req.params.containerId, function(err, container, data, manifest) {

    if (err) {
      return next(err);
    }

    const lineNb = req.query.tail || 1000;
    container.logs({ stdout: true, tail: lineNb }, (err, stream) => {
      if (err) {
        return res.status(err.statusCode).send(err.reason).end();
      }
      stream.on('data', (chunk) => {
        res.write(stripAnsi(chunk.toString()));
      });
      stream.on('end', () => {
        res.end();
      });
    });
  });
});


module.exports = router;
