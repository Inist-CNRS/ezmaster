  /*eslint no-sync: "off"*/

'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , moment = require('moment')
  , util = require('utile')
  , fs = require('fs')
  , glob = require('glob')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , sortBy = require('sort-by')
  , _ = require('lodash')
  , exec = require('child_process').exec
  ;


// Cache explanations:
// We store the instances in a cache to avoid doing too much slow "docker ps"
// When an action is performed in route.js (start, stop, delete, update config, add instance),
// we call refreshInstances() which call getInstances(true)
var cacheInstances = null;

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
module.exports.getInstances = function (cb) {

  // If we have to get the list and update the cache.
  if (cacheInstances) {
    return cb(null, cacheInstances);
  }

  util.async.parallel([

    // Retrieves all instances manifests from the files.
    function (handleManifests) {

      // Read the content of manifests folders in order to
      // extract the instances technicalName and some metadata.
      var manifestPath = cfg.dataManifestsPath + '/*.json';
      glob(manifestPath, function (err, files) {

        if (err) {
          debug('cannot read the folder, something goes wrong with glob', err);
          return handleManifests(err);
        }

        // If no files then return an empty array.
        if (files.length === 0) {
          return handleManifests(null, []);
        }

        var manifests = [];
        files.forEach(function (file) {

          // Extract the technicalName from the filename and read
          // the manifest content to get other metadata.
          // NOTA : filename example : 'manifests/myprj-mystudy-5.json'
          //         then technicalName will be 'myprj-mystudy-5'.
          var technicalName = _.last(file.slice(0, -5).split('/'));
          fs.readFile(file, 'utf8', function (err, manifestContent) {
            if (err) {
              debug('cannot read the file, something goes wrong with the file', err);
              return handleManifests(err);
            }

            var manifest = JSON.parse(manifestContent);
            manifest.technicalName = technicalName;
            manifests.push(manifest);

            // Return the manifests when the
            // last file is handled.
            if (manifests.length == files.length) {
              return handleManifests(null, manifests);
            }
          });
        });
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
    function (handleDockerInstances) {

      docker.listContainers({ all : true }, function (err, containers) {

        if (err) {
          return handleDockerInstances(err);
        }

        var dockerInstances = [];
        containers.forEach(function (data) {

          var instance = {};

          // Example of data.Names[0] : /myprj-mystudy-5
          instance.technicalName = data.Names[0].split('/')[1];
          instance.containerId   = data.Id;
          instance.dataPath      = process.env.EZMASTER_PATH+'/data/instances/'
            +instance.technicalName+'/data/';
          instance.creationDate  = moment.unix(data.Created).format('YYYY/MM/DD HH:mm:ss');
          instance.app           = data.Image;

          if (data.State === 'running') {

            instance.running = true;

            // search the correct PublicPort port mapped to the internal one
            // Example of data in data.Ports:
            // [ { PrivatePort: 59599, Type: 'tcp' },
            //   { IP: '0.0.0.0', PrivatePort: 3000, PublicPort: 32769, Type: 'tcp' } ]
            // we have to take the one having a PublicPort
            var portToHandle = data.Ports.filter(function (elt) {
              return elt.PublicPort !== undefined;
            });

            if (portToHandle.length > 0 && portToHandle[0].PublicPort) {
              instance.port = portToHandle[0].PublicPort;
              instance.publicURL = 'http://'
                + process.env.EZMASTER_PUBLIC_IP + ':' + instance.port;
              if (!process.env.EZMASTER_PUBLIC_IP) {
                instance.publicURL = 'http://127.0.0.1:' + instance.port;
              }
            } else {
              instance.publicURL = '';
            }

            instance.target = data.Names[0].split('/')[1];

          } else if (data.State === 'exited') {

            instance.running = false;
            instance.port    = [];
            instance.publicURL = '';
            instance.target  = '';

          }

          dockerInstances.push(instance);
        });

        // Sort dockerInstances by creationDate.
        // Aim : conserve same order while displaying instances on the client.
        // The '-' means that we want a reversed order.
        dockerInstances.sort(sortBy('-creationDate'));

        // Once docker containers are parsed we return the
        // Ezmaster formated instances list.
        return handleDockerInstances(null, dockerInstances);
      });
    }


  ], function (err, results) {


    if (err) { return cb(err); }
    // Retrieves results from the two callbacks (manifests files and docker metadata)
    // and ignores docker containers not listed in the manifests ("unknown technicalName").
    // Example: ezmaster itself or ezmaster_db
    // or any other container currently running on the machine.
    var ezmasterInstances = {};
    results[1].forEach(function (dockerInstance) {
      results[0].forEach(function (manifest) {
        if (manifest.technicalName === dockerInstance.technicalName) {
          ezmasterInstances[manifest.technicalName] = _.assign(dockerInstance, manifest);
        }
      });
    });

    // cacheInstances update the instances list.
    cacheInstances = ezmasterInstances;

    // Return the just get instances list.
    return cb(null, ezmasterInstances);
  });

};





// This function refreshes the instances list on table.js component.
// Done by sending the instances list with socket to the component table.js.
// The component table.js is listening to messages coming from here.
module.exports.refreshInstances = function () {

  // Get the socket.io socket
  var socket = cfg.socket;

  // clear the cache before geting the new list
  cacheInstances = null;

  // true for instancesChangesBool because we need to update the cache and
  // get the new instances list.
  module.exports.getInstances(function (err, instancesList) {

    if (err) { return new Error(err); }

    // Broadcast to all clients this new version to :
    //  - update the 'containers' variable
    //  - refresh the table.js component
    // This is the table.js component which receives the emit message.
    // If the socket variable is defined, we broadcast.
    socket && socket.broadcast.emit('refreshInstances', instancesList);

    // For Local Tests.
    socket && socket.emit('refreshInstances', instancesList);

  });

};

/**
 * Returns the internal ip of the wanted instance
 * (used for unittests)
 */
module.exports.getInstanceInternalIp = function (techName, cb) {
  var cmd = 'docker inspect '
    + '--format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" '
    + techName;
  exec(cmd, function (err, stdout, stderr) {
    cb(err, ('' + stdout).trim());
  });
};

/**
 * Initialize an instance with the original
 * data coming from the application
 */
module.exports.initConfigAndData = function (params, cb) {
  module.exports.initConfig(params, function (err) {
    if (err) return cb(err);
    module.exports.initData(params, function (err) {
      return cb(err);
    });
  });
};
module.exports.initConfig = function (params, cb) {
  // check the config file exists before doing anything
  exec('docker run --rm --entrypoint "/bin/ls" ' + params.appSrc
    + ' ' + params.appConfig.configPath, function (err, stdout, stderr) {
    // config file does not exists, skip this step
    if (err) return cb(null);

    // config file exists so copy the config file
    exec('docker run --rm --entrypoint "/bin/cat" ' + params.appSrc
      + ' ' + params.appConfig.configPath
      + ' > config/config.json', {
        cwd: cfg.dataInstancesPath + '/' + params.instanceDst
      }, function (err, stdout, stderr) {
        return cb(err);
      });
  });

};
module.exports.initData = function (params, cb) {
  // check the data folder is not empty before doing anything
  if (!params.appConfig.dataPath) return cb(null);
  exec('docker run --rm --entrypoint "/bin/ls" ' + params.appSrc
    + ' ' + params.appConfig.dataPath,
    function (err, stdout, stderr) {
      // data folder is empty or doesnot exists, skip this step
      if (err || stdout == '') return cb(null);

      // then thanks to tar commande, copy the data folder content into the instance initial state
      // example:
      // docker run --rm -w /blog/source/_posts --entrypoint "/bin/tar" \
      //  inistcnrs/ezmaster-hexo:latest cf - \ -C /blog/source/_posts . | tar vxf -
      exec('docker run --rm --entrypoint "/bin/tar" ' + params.appSrc
        + ' cf - -C ' + params.appConfig.dataPath + ' . | tar vxf -', {
          cwd: cfg.dataInstancesPath + '/' + params.instanceDst + '/data/'
        }, function (err, stdout, stderr) {
          return cb(err);
        });
    }
  );
};

