  /*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , Docker = require('dockerode')
  , util = require('utile')
  , moment = require('moment')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});


module.exports.getApps = function (cb) {

  docker.listImages({ all : true }, function (err, images) {

    if (err) { return new Error(err); }

    var apps = [];


    images.forEach(function (image) {

      var instance = {};

      var nameImage = image.RepoTags[0].split('/')[0];

      console.log("qafEFQZZEFQZ"+ util.inspect(image));

      if ( nameImage === 'inistcnrs' &&
       image.RepoTags[0].split('/')[1].split(':')[0] != 'ezmaster' || nameImage === 'matthd' ) {
        instance.imageName = image.RepoTags[0];
        instance.creationDate = moment.unix(image.Created).format('YYYY/MM/DD HH:mm:ss');
        apps.push(instance);
      }

    });
    return cb(null, apps);

  });


};