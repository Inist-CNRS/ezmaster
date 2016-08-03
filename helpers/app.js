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
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});




module.exports.getApps = function (cb) {


  util.async.parallel([

    // Retrieves all instances manifests from the files.
    function (handleManifests) {

      // Read the content of manifests folders in order to
      // extract the instances technicalName and some metadata.
      var manifestPath = path.join(__dirname, '../applications/apps.json').toString();

      var manifests = [];


      fs.readFile(manifestPath, 'utf8', function (err, manifestContent) {
        if (err) {
          debug('cannot read the file, something goes wrong with the file', err);
          return handleManifests(err);
        }

        manifests.push(manifestContent);

        console.error(manifestContent);

        return handleManifests(null, manifests);

      });
    },


    function (handleApplications) {


      docker.listImages({ all : true }, function (err, images) {

        if (err) { return new handleApplications(err); }

        var apps = [];


        images.forEach(function (image) {

          var app = {};
          var nameImage = image.RepoTags[0].split('/')[0];

          if (nameImage === 'inistcnrs' &&
           image.RepoTags[0].split('/')[1].split(':')[0] != 'ezmaster' || nameImage === 'matthd') {
            app.imageId = image.Id.split(':')[1];
            app.imageName = image.RepoTags[0];
            app.creationDate = moment.unix(image.Created).format('YYYY/MM/DD HH:mm:ss');
            apps.push(app);
          }

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