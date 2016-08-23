  /*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , util = require('utile')
  , fs = require('fs')
  , Docker = require('dockerode')
  , moment = require('moment')
  , _ = require('lodash')
  , glob = require('glob')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});




module.exports.getApps = function (cb) {


  util.async.parallel([

    // Retrieves all instances manifests from the files.
    function (handleManifests) {

      // Read the content of manifests folders in order to
      // extract the instances technicalName and some metadata.
      var manifestPath = path.join(__dirname, '../applications/*.json').toString();
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

          var manifest = {};


          fs.readFile(file, 'utf8', function (err, manifestContent) {
            if (err) {
              debug('cannot read the file, something goes wrong with the file', err);
              return handleManifests(err);
            }

            manifest = JSON.parse(manifestContent);
            manifests.push(manifest);
          });
        });
        return handleManifests(null, manifests);
      });
    },


    function (handleApplications) {


      docker.listImages({ all : true }, function (err, images) {

        if (err) { return new handleApplications(err); }

        var apps = [];


        images.forEach(function (image) {

          var app = {};

          app.imageId = image.Id.split(':')[1];
          app.imageName = image.RepoTags[0];
          app.creationDate = moment.unix(image.Created).format('YYYY/MM/DD HH:mm:ss');
          apps.push(app);

        });

        return handleApplications(null, apps);

      });
    }


  ], function (err, results) {


    if (err) { return cb(err); }

    var ezmasterApplications = {};

    results[1].forEach(function (dockerApplication) {
      results[0].forEach(function (manifest) {
        if (manifest.imageName === dockerApplication.imageName) {
          ezmasterApplications[manifest.imageName] = _.assign(dockerApplication, manifest);
        }
      });
    });

    // Return the just get instances list.
    return cb(null, ezmasterApplications);
  });
};