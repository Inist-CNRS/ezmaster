/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , bodyParser = require('body-parser')
  , docker = require('../lib/docker.js').docker
  , fs = require('fs')
  , rimraf = require('rimraf')
  , app = require('../lib/app.js')
  , moment = require('moment')
  , udisk = require('../lib/diskusage.js');


var express = require('express');
var router = express.Router();

router.route('/').get(function (req, res, next) {
  debug('GET ', req.originalUrl);

  app.getApps(function (err, data) {

    if (err) { return next(err); }
    return res.status(200).send(data);

  });

});



/**
 * Creates a new application (docker pull)
 */
router.route('/').post(bodyParser(), function (req, res, next) {
  debug('POST ', req.originalUrl);

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

        // notify the client of docker pull download progress info
        // and do not send too much data (wait 200ms)
        if (!app.dockerPullIsSpammed) {
          setTimeout(function () {
            app.dockerPullIsSpammed = false;
          }, 200);

          // check durring the docker pull there is still disk space
          udisk(function(err, info) {

            if (err) { return new Error(err); }

            // If we do not have enough space on the disk
            // we cut the docker pull stream
            if (info.fsIsAlmostFilled) {
              return stream.req.destroy();
            }

            if (event['status'] != null && event.progress != null &&
                event.progress.split(']')[1] != 'error during stream parsing') {
              // notify the client of docker pull download progress info
              socket.emit('statusPull', event.status + ': ' + event.progress.split(']')[1]);
              app.dockerPullIsSpammed = true;
            }
          });
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
      if (err) { return res.status(500).send('Not enough space on the disk - ' + err); }

      var imageName = {
        'imageName' : imageToPull,
        'imageId' : data.Id.split(':')[1],
        'creationDate' :  moment(data.Created, moment.ISO_8601).format('YYYY/MM/DD hh:mm:ss')
      };

      var nameManifest = new Buffer(imageToPull).toString('base64');

      fs.writeFile(cfg.dataApplicationsPath + '/' + nameManifest + '.json'
      , JSON.stringify(imageName, null, 2), function (err) {
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

  debug('DELETE ', name);

  image.remove(function (err, datas, cont) {

    if (err) {
      return res.status(500).send(err);
    }

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
