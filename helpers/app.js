  /*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  //, util = require('utile')
  , fs = require('fs')
  , Docker = require('dockerode')
  , glob = require('glob')
  , exec = require('child_process').exec
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

/**
 * Returns the ezmaster configuration from the specified application image
 * the config path is /etc/ezmaster.json
 * cb is called with two parameters:
 * - err:    is null if config is filled
 *           err.code = 1 if ezmaster.json does not exists
 *           err.code = 2 if ezmaster.json is not a valid JSON
 *           err.code = 125 if image is not found
 * - config: the JSON (if no /etc/ezmaster.json is found, it 
 *           returns the symlink old convention)
 */
module.exports.readEzmasterAppConfig = function (image, cb) {
  cb = cb || function () {};
  var defaultConfig = {
    httpPort: 3000,
    configPath: '/opt/ezmaster/config/config.json',
    dataPath:   '/opt/ezmaster/data/'
  };
  var cmd = 'docker run --rm --entrypoint "/bin/cat" ' + image + ' /etc/ezmaster.json';
  exec(cmd, function (err, stdout, stderr) {
    debug(err, stdout, stderr)
    if (err) {
      // image is not found or ezmaster.json does not exists
      return cb(err, defaultConfig);
    }
    try {
      stdout = JSON.parse(stdout);
      return cb(null, stdout);
    } catch (err2) {
      // ezmaster.json is not a valid JSON
      err2 = new Error(err2);
      err2.code = 2;
      return cb(err2, defaultConfig);
    }
  });
};



/**
 * Check if it exists a such image in the local docker cache
 * (docker images)
 */
module.exports.checkIfAppExistsInLocalCache = function (image, cb) {
  cb = cb || function () {};
  var cmd = 'docker images ' + image + ' --format "{{.ID}}"';
  exec(cmd, function (err, stdout, stderr) {
    if (err) return cb(err, false);
    var imgExists = (stdout != '');
    return cb(null, imgExists);
  });
};
