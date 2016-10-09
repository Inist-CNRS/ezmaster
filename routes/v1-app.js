/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , getSize = require('get-folder-size')
  , filesize = require('filesize')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , exec = require('child_process').exec
  , jsonfile = require('jsonfile')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , fileExists = require('file-exists')
  , instances = require('../lib/instances.js')
  , app = require('../lib/app.js')
  , instancesArray
  , containers
  , portMax
  , freePortSplitted
  , moment = require('moment')
  , mmm = require('mmmagic')
  , Magic = mmm.Magic
  , multer = require('multer')
  , disk = require('diskusage')
  , _ = require('lodash');
jsonfile.spaces = 2;


var express = require('express');
var router = express.Router();

router.route('/').get(function (req, res, next) {

  app.getApps(function (err, data) {

    if (err) { return next(err); }
    return res.status(200).send(data);

  });

});



/**
 * Creates a new application (docker pull)
 */
router.route('/').post(bodyParser(), function (req, res, next) {

  var image = req.body.imageName;
  var tag = req.body.versionImage;
  var registery = req.body.imageHub;
  var username = req.body.username;
  var password = req.body.password;
  var imageToPull = image+':'+tag;

  if (registery != '') {
    var auth = {
      username: username,
      password: password
    };

    imageToPull = registery+'/'+image+':'+tag;
  }

  app.checkIfAppExistsInLocalCache(imageToPull, function (err, imgAlreadyPulled) {
    if (err) { return next(err); }
    if (imgAlreadyPulled) {
      return afterTheImageIsPulled(null,
        'Application ' + imageToPull +
        ' already pulled. It exists in the local cache.');
    }
    // pull the image once we checked it does not exists in the local cache
    docker.pull(imageToPull, {'authconfig': auth}, function(err, stream) {

      if (err) { return next(err); }

      docker.modem.followProgress(stream, afterTheImageIsPulled, onImagePullProgress);

      function onImagePullProgress(event) {

        var socket = cfg.socket;
        if (!socket) {
          return;
        }

        var totalDisk;
        var availableDisk;

        disk.check('/', function(err, info) {

          if (err) { return new Error(err); }
          totalDisk = info.total;
          availableDisk = info.available;
        });

        // If we have enough space on the disk we can continue the pull of the image
        if (totalDisk*(cfg.fullFsPercent/100)
          >= totalDisk*(cfg.fullFsPercent/100)-(totalDisk-availableDisk)) {

          if (event['status'] != null && event.progress != null
          &&  event.progress.split(']')[1] != 'error during stream parsing') {

            socket.broadcast.emit('progressBar', event.progress.split(']')[1]);
            socket.emit('progressBar', event.progress.split(']')[1]);

            socket.broadcast.emit('statusPull', event.status+':');
            socket.emit('statusPull', event.status+':');

          }
        } else {
          //We cut the stream and go to the Onfinished function
          stream.req.destroy();

        }
      }
    });


  });

  function afterTheImageIsPulled(err, output) {

    if (err) { return res.status(500).send('' + err); }

    var container = docker.getImage(imageToPull);

    container.inspect(function (err, data) {

      //If the ocntainer is not found, it's mean the pull has been stop
      //During the onImagePullProgress function, because there is not enough space on the disk
      if (err) { return res.status(500).send('Not enough space on the disk'); }

      var imageName = {
        'imageName' : imageToPull,
        'imageId' : data.Id.split(':')[1],
        'creationDate' :  moment(data.Created, moment.ISO_8601).format('YYYY/MM/DD hh:mm:ss')
      };

      var nameManifest = new Buffer(imageToPull).toString('base64');

      jsonfile.writeFile(cfg.dataApplicationsPath + '/' + nameManifest + '.json'
      , imageName, function (err) {
        if (err) {
          return res.status(500).send('' + err);
        }
        return res.status(200).send(output);
      });
    });

  }


});



router.route('/:imageId').delete(function (req, res, next) {

  var name = new Buffer(req.params.imageId, 'base64').toString();

  var image = docker.getImage(name);

  image.remove(function (err, datas, cont) {

    if (err) { return res.status(409).send('' + err); }

    var nameManifest = req.params.imageId;

    rimraf(
      cfg.dataApplicationsPath + '/' + nameManifest + '.json'
    , function (err) {
      if (err) { return next(err); }
    });

    res.status(200).send('Removing done');

  });

});

module.exports = router;