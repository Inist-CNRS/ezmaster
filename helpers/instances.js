/*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , moment = require('moment')
  , util = require('utile')
  , fs = require('fs')
  , glob = require(('glob')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , _ = require('lodash');



  module.exports.getInstances = function (cb) {

    util.async.parallel([

      // retrive all instances manifests from the files
      function (handleManifests) {

        // read the content of manifests folders in order to
        // extract the instances technicalName and some metadata
        // TODO: ajouter __dirname + "/../
        glob('manifests/*.json', function (err, files) {

          if (err) {
            debug('cannot read the folder, something goes wrong with glob', err);
            return handleManifests(err);
          }

          // if no files then return an empty array
          if (files.length === 0) {
            return handleManifests(null, []);
          }

          var manifests = [];
          files.forEach(function (file) {

            // Extract the technicalName from the filename and read
            // the manifest content to get other metadata
            // Notice: filename example 'manifests/myprj-mystudy-5.json'
            //         then technicalName will be 'myprj-mystudy-5'
            var technicalName = file.split('/')[1].split('.')[0];
            fs.readFile(file, 'utf8', function (err, manifestContent) {
              if (err) {
                debug('cannot read the file, something goes wrong with the file', err);
                return handleManifests(err);
              }

              var manifest = JSON.parse(manifestContent);
              manifest.technicalName = technicalName;
              manifests.push(manifest);

              // return the manifests when the
              // last file is handled
              if (manifests.length == files.length) {
                return handleManifests(null, manifests);
              }
            });

          });


        });


      },

      // Retrives the instances docker informations. Ex:
      // - technicalName: 'article-type-4',
      // - containerId: '1e254654654465446545465465456465465',
      // (- dataPath: '/applis/lodex/home/instances/article-type-4')
      // - creationDate: '2016/03/17',
      // - port: 35284,
      // - app: 'inistcnrs/lodex:2.0.1',
      // - running: true
      function (handleDockerInstances) {

        docker.listContainers({ all : true }, function (err, containers) {

          var dockerInstances = [];
          containers.forEach(function (data){

            var instance = {};

            // Example of data.Names[0]: /myprj-mystudy-5
            instance.technicalName = data.Names[0].split('/')[1];
            instance.containerId   = data.Id;
            instance.dataPath      = '/instances/'+technicalName+'/';
            instance.creationDate  = moment.unix(data.Created).format('YYYY/MM/DD')
            instance.app           = data.Image;

            if (data.State === 'running') {

              instance.running = true;
              instance.port    = data.Ports[0].PublicPort;

              // TODO: comments needed
              //       maybe "address" is wrongly named ? publicUrl would be better ?
              instance.address = 'http://'
                + process.env.EZMASTER_PUBLIC_IP
                + ':' + data.Ports[0].PublicPort;
              if (!process.env.EZMASTER_PUBLIC_IP) {
                instance.address = 'http://127.0.0.1:' + data.Ports[0].PublicPort;
              }
              instance.target = data.Names[0].split('/')[1];

            } else if (data.State === 'exited') {

              instance.running = false;
              instance.port    = [];
              instance.address = '';
              instance.target  = '';

            }

            dockerInstances.push(instance);
          });

          // once docker containers are parsed we return the
          // ezmaster formated instances list
          return handleDockerInstances(null, dockerInstances);
        });

      }


  ], function (err, results) {

    // retrives results from the two callbacks (manifests files and docker metadata)
    // and ignore docker containers not listed in the manifests ("unknown technicalName")
    // (example: ezmaster itself or ezmaster_db
    // or any other containers currently running on the machine)
    var ezmasterInstances = {};
    results[0].forEach(function (manifest) {
      results[1].forEach(function (dockerInstance) {
        if (manifest.technicalName === dockerInstance.technicalName) {
          ezmasterInstances[manifest.technicalName] = _.assign(dockerInstance, manifest);
        }
      });
    });

    return cb(null, ezmasterInstances);
  });
};