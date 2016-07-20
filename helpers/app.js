  /*eslint no-sync: "off"*/

'use strict';

var path = require('path')
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
  ;
module.exports.getApps = function (cb) {

  docker.listImages({ all : true }, function (err, images) {

    var apps = [];

    images.forEach(function (image) {
      if (image.RepoTags[0].split('/')[0] === 'inistcnrs' && image.RepoTags[0].split('/')[1].split(':')[0] != 'ezmaster') {
        apps.push(image.RepoTags[0]);
      }

    });
    return cb(null,apps);

  });


};