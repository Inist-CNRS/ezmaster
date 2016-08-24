  /*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  //, util = require('utile')
  , fs = require('fs')
  , Docker = require('dockerode')
  , glob = require('glob')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});




module.exports.getApps = function (cb) {


  var manifestPath = path.join(__dirname, '../applications/*.json').toString();
  glob(manifestPath, function (err, files) {

    if (err) {
      debug('cannot read the folder, something goes wrong with glob', err);
      return cb(err);
    }

    // If no files then return an empty array.
    if (files.length === 0) {
      return cb(null, []);
    }

    var manifests = [];
    files.forEach(function (file) {

      var manifest = {};


      fs.readFile(file, 'utf8', function (err, manifestContent) {
        if (err) {
          debug('cannot read the file, something goes wrong with the file', err);
          return cb(err);
        }

        manifest = JSON.parse(manifestContent);

        var image =docker.getImage(manifest.imageName);

        if (image !== undefined) {
          manifests.push(manifest);
          if (manifests.length === files.length) {
            return cb(null, manifests);
          }
        }
      });
    });
  });
};
