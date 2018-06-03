  /*eslint no-sync: "off"*/

'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , fs = require('fs')
  , glob = require('glob')
  , exec = require('child_process').exec
  , cache = require('memory-cache')
  , docker = require('./docker.js').docker;




module.exports.getApps = function (cb) {

  glob(cfg.dataApplicationsPath + '/*.json', function (err, files) {

    if (err) {
      debug('cannot read the folder, something goes wrong with glob', err);
      return cb(err);
    }

    // If no files then return an empty array.
    if (files.length === 0) {
      return cb(null, []);
    }

    var manifests = [];
    var nbImagesHandled = 0;
    files.forEach(function (file) {

      var manifest = {};


      fs.readFile(file, 'utf8', function (err, manifestContent) {
        if (err) {
          debug('cannot read the file, something goes wrong with the file', err);
          return cb(err);
        }

        manifest = JSON.parse(manifestContent);

        var image = docker.getImage(manifest.imageName);
        image.inspect(function (err, data) {
          nbImagesHandled++;
          if (err) {
            debug('Remove ' + manifest.imageName + ' from the list because it does not exists on the host. ' + err) 
          } else {
            manifest.image = data;
            manifests.push(manifest);    
          }
          if (files.length === nbImagesHandled) {
            return cb(null, manifests);
          }
        });
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

  // check if the data are cached
  if (cache.get(cmd)) {
    return cb(null, cache.get(cmd));
  }

  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      // image is not found or ezmaster.json does not exists
      cache.put(cmd, defaultConfig,  60 * 60 * 1000); // garde en mémoire pendant 1h
      return cb(err, defaultConfig);
    }
    try {
      stdout = JSON.parse(stdout);
    } catch (err2) {
      // ezmaster.json is not a valid JSON
      var err3 = new Error(err2);
      err3.code = 2;
      stdout = null;
    }

    if (stdout) {
      cache.put(cmd, stdout,  60 * 60 * 1000); // garde en mémoire pendant 1h
    }

    return cb(err3 || null, stdout || defaultConfig);
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
