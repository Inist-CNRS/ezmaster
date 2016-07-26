  /*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});


module.exports.getApps = function (cb) {

  docker.listImages({ all : true }, function (err, images) {

    if (err) { return new Error(err); }

    var apps = [];

    images.forEach(function (image) {
      if (image.RepoTags[0].split('/')[0] === 'inistcnrs' &&
       image.RepoTags[0].split('/')[1].split(':')[0] != 'ezmaster') {
        apps.push(image.RepoTags[0]);
      }

    });
    return cb(null, apps);

  });


};