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
  ;
jsonfile.spaces = 2;


var express = require('express');
var router = express.Router();

router.route('/-/v1/app').get(function (req, res, next) {
  
  app.getApps(function (err, data) {

    if (err) { return next(err); }
    return res.status(200).send(data);

  });

});

/**
 * Returns the instance list
 */
router.route('/-/v1/instances').get(function (req, res, next) {

  instances.getInstances(function (err, data) {
    if (err) { return next(err); }
    return res.status(200).send(data);
  });

});


/**
 * Start an instance
 */
router.route('/-/v1/instances/start/:containerId').put(bodyParser(), function (req, res, next) {

  var container = docker.getContainer(req.params.containerId);

  container.inspect(function (err, data) {

    if (err) { return next(err); }

    container.start(function (err, datas, container) {
      if (err) { return next(err); }

      // When an instance is started, we call refreshInstances() to update
      // the instances list cache and socket emit the updated list to all users.
      instances.refreshInstances();

      res.status(200).send('Starting done');

    });

  });
});



/**
 * Stop an instance
 */
router.route('/-/v1/instances/stop/:containerId').put(bodyParser(), function (req, res, next) {

  var container = docker.getContainer(req.params.containerId);

  container.inspect(function (err, data) {

    if (err) { return next(err); }

    container.stop(function (err, datas, container) {
      if (err) { return next(err); }

      // When an instance is stopped, we call refreshInstances() to update the
      // instances list cache and socket emit the updated list to all users.
      instances.refreshInstances();

      res.status(200).send('Stoping done');
    });

  });
});



/**
 * Update a config.json of a specific instance
 */
router.route('/-/v1/instances/config/:containerId').put(bodyParser(), function (req, res, next) {

  var container = docker.getContainer(req.params.containerId);

  container.inspect(function (err, data) {

    if (err) { return next(err); }

    var splittedName = data.Name.split('/');

    jsonfile.writeFile(
      cfg.dataInstancesPath + '/' + splittedName[1] + '/config/config.json',
      req.body.newConfig, function (err) {

        if (err) { return next(err); }

        if (data.State.Running == true) {
          container.restart(function (err) {
            if (err) { return next(err); }
            res.status(200).send('Update done');
          });
        }
        else {
          res.status(200).send('Update done');
        }
      });

    // When a new config is given to an instance, we call refreshInstances() to update the
    // instances list cache and socket emit the updated list to all users.
    instances.refreshInstances();

  });
});


/**
 * Check whether there is a manifest for the passed technicalName
 * Returns OK when the manifest does not yet exist
 * Returns KO when the manifest already exist
 */
router.route('/-/v1/instances/verif/:technicalName').get(bodyParser(), function (req, res, next) {

  if (fileExists(cfg.dataManifestsPath + '/' + req.params.technicalName + '.json')
  == false) {
    res.status(200).send('OK');
  }
  else {
    res.status(200).send('KO');
  }

});



router.route('/-/v1/instances/:containerId').get(bodyParser(), function (req, res, next) {

  var container = docker.getContainer(req.params.containerId);

  container.inspect(function (err, data) {

    if (err) { return next(err); }

    var splittedName = data.Name.split('/');

    // Get Delete Information.
    var directoryDatas = cfg.dataInstancesPath + '/' + splittedName[1] + '/data/'
      , result = {};

    getSize(directoryDatas, function (err, size) {

      if (err) { return next(err); }

      result.technicalName = splittedName[1];
      result.size = filesize(size);

      // Get Configuration Information.
      jsonfile.readFile(
        cfg.dataInstancesPath + '/' + splittedName[1] + '/config/config.json',
      function (err, obj) {

        if (err) { return next(err); }

        result.config = obj;

        return res.status(200).send(result);

      });

    });

  });

});



router.route('/-/v1/instances/:containerId').delete(function (req, res, next) {
  var container = docker.getContainer(req.params.containerId);

  removeInstance(container);

  function removeInstance (container) {

    container.inspect(function (err, data) {
      if (err) { return next(err); }

      if (data.State.Running == true) {
        container.stop(function (err, datas, cont) {
          if (err) { return next(err); }

          container.remove(function (err, datas, cont) {
            if (err) { return next(err); }

          });
        });
      }
      else if (data.State.Running == false) {
        container.remove(function (err, datas, cont) {
          if (err) { return next(err); }
        });
      }

      removeManifest(err, data.Name);
    });
  }

  function removeManifest (err, containerName) {

    if (err) { return res.status(500).send('' + err); }

    var splittedName = containerName.split('/');
    rimraf(cfg.dataInstancesPath + '/' + splittedName[1], function (err) {
      if (err) { return next(err); }

      rimraf(cfg.dataManifestsPath + '/' + splittedName[1] + '.json', function (err) {
        if (err) { return next(err); }

        // When an instance is deleted, we call refreshInstances() to update the
        // instances list cache and socket emit the updated list to all users.
        instances.refreshInstances();

        res.status(200).send('Removing done');
      });
    });
  }
});



/**
 * Route to create a new instance
 */
router.route('/-/v1/instances').post(bodyParser(), function (req, res, next) {

  var technicalName = req.body.technicalName
    , longName = req.body.longName
    , image = req.body.app
    , project = req.body.project
    , study = req.body.study
    , version = req.body.version
    ;

  if (/^[a-z0-9]+$/.test(project) == false && project != '' && project != null) {
    return res.status(400).send('Enter a valid project name');
  }

  if (/^[a-z0-9]+$/.test(study) == false && study != '' && study != null) {
    return res.status(400).send('Enter a valid study name');
  }

  if (/^[0-9]*$/.test(version) === false) {
    return res.status(400).send('Enter a valid version number');
  }

  if (fileExists(cfg.dataManifestsPath + '/' + req.query.technicalName + '.json') == true) {
    res.status(409).send('Technical name already exists');
  }
  else {
    mkdirp(cfg.dataInstancesPath + '/' + technicalName + '/config/', makeDataDirectory);
  }


  function makeDataDirectory(err) {
    if (err) { return next(err); }

    mkdirp(cfg.dataInstancesPath + '/' + technicalName + '/data/', createConfigFile);
  }


  function createConfigFile(err) {
    if (err) { return next(err); }

    fs.appendFile(cfg.dataInstancesPath + '/' + technicalName + '/config/config.json'
      , '{}'
      , readInstances
    );
  }


  function readInstances(err) {
    if (err) { return next(err); }

    instancesArray = fs.readdirSync(cfg.dataInstancesPath);

    docker.listContainers({all : true}, createInstance);
  }


  function createInstance(err, containersList) {
    if (err) { return next(err); }

    containers = containersList;

    portMax = 0;
    freePortSplitted = cfg.freePortRange.split('-');

    checkContainer();
  }

  function checkContainer() {
    var element = containers.pop();

    if (element) {
      var splittedName = element.Names[0].split('/');
      if (instancesArray.indexOf(splittedName[1]) === -1) {
        return checkContainer();
      }

      var container = docker.getContainer(element.Id);

      container.inspect(checkPort);
    }
    else {
      if (!Number.isInteger(portMax) || portMax == 0) {
        portMax = freePortSplitted[0];
      }

      // reads from the image where is located the port, config and data
      // ex: {
      //   port: 3333,
      //   config: '/myapp/config.json',
      //   data: /myapp/data/
      // }
      app.readEzmasterAppConfig(image, function (err, appConfig) {

        instances.initConfigAndData({ instanceDst: technicalName,
                                      appSrc: image,
                                      appConfig: appConfig }, function (err) {
          if (err) return next(err);

          var publicDomain = cfg.publicDomain;
          var publicUrl;
          if (publicDomain) {
            publicUrl = 'http://' + technicalName + '.' + publicDomain;
          } else {
            publicUrl = 'http://'
              + process.env.EZMASTER_PUBLIC_IP + ':' + appConfig.httpPort;
            if (!process.env.EZMASTER_PUBLIC_IP) {
              publicUrl = 'http://127.0.0.1:' + appConfig.httpPort;
            }
          }

          // prepare the command line to create and run the instance
          var cmd = 'docker run -dt -p ' + portMax + ':' + appConfig.httpPort+ ' '
          + '-e http_proxy -e https_proxy -e no_proxy -e EZMASTER_MONGODB_HOST_PORT '
          + '-e EZMASTER_TECHNICAL_NAME="' + technicalName + '" '
          // eslint-disable-next-line quotes
          + '-e EZMASTER_LONG_NAME="' + longName.replace('"', "\\\"") + '" '
          + '-e EZMASTER_APPLICATION="' + image + '" '
          + '-e DEBUG '
          + '-e EZMASTER_PUBLIC_URL="' + publicUrl + '" '
          + '--net=ezmaster_default --link ezmaster_db '
          + '-v ' + process.env.EZMASTER_PATH + '/data/instances/'
          + technicalName + '/config/config.json:' + appConfig.configPath + ' '
          + (appConfig.dataPath ? '-v ' + process.env.EZMASTER_PATH + '/data/instances/'
                                  + technicalName + '/data/:' + appConfig.dataPath + ' ' : '')
          + '--name ' + technicalName + ' ' + image;

          // and execute !
          exec(cmd, function (err, stdout, stderr) { refreshAndReturn(err, appConfig); });

          // creates the instance manifest
          jsonfile.writeFile(cfg.dataManifestsPath + '/' + technicalName + '.json'
            , { 'longName' : longName }, function (err) {
              if (err) { return next(err); }
            });
        });
      });

    }
  }


  function checkPort(err, data) {
    if (err) { return next(err); }

    var keys =  Object.keys(data.HostConfig.PortBindings);
    var currentPort = data.HostConfig.PortBindings[keys[0]][0].HostPort;

    if (currentPort >= portMax) {
      portMax = parseInt(currentPort) + 1;
    }

    return checkContainer();
  }


  function refreshAndReturn(err, appConfig) {
    if (err) { return next(err); }

    // When an instance is created, we call refreshInstances() to update the
    // instances list cache and socket emit the updated list to all users.
    instances.refreshInstances();

    return res.status(200).send('Instance created');
  }

}); // End of the route.



/**
 * Route to upload a file directly from the html upload form.
 */
router.route('/-/v1/instances/:instanceId/data/')
.post(bodyParser(), function (req, res, next) {

  // Get freeDisk space.
  disk.check('/', function(err, info) {

    if (err) { return new Error(err); }

    // Examining the container.
    var container = docker.getContainer(req.params.instanceId);

    container.inspect(function (err, data) {

      if (err) { return next(err); }

      // Split the instance name.
      var splittedName = data.Name.split('/');

      // We use multer to pass data from the input type file to this route file.
      // Multer is coupled with bodyparser because it can't manage input type file alone anymore.
      var storage = multer.diskStorage({

        destination: function (req, file, callback) {

          // We save the file in the correct folder.
          // splittedName[1] is the instance technical name.
          callback(null, cfg.dataInstancesPath + '/' + splittedName[1] + '/data');

        },

        filename: function (req, file, callback) {

          // We upload the file with its original name.
          callback(null, file.originalname);

        }

      });

      // We use it to cap the upload size with multer.
      var capSize = info.total*(cfg.fullFsPercent/100)-(info.total-info.available);

      // The upload concerns the button which id is btnFile.
      // The Multer .any() method allows to select multiple files.
      // limits : the user can't upload a file which size is greater than capSize.
      var upload = multer({ storage : storage, limits: { fileSize: capSize }}).any('btnFile');

      // The upload.
      upload(req, res, function(err) {

        if (err) {

          // A problem occured while uploading.
          return res.end('Error uploading file.');

        }
        // Else, the upload went well.
        //res.end("File is uploaded");

      });

    });

  });

});



/**
 * Route to get information on the data files from a specific instance.
 */
router.route('/-/v1/instances/:instanceId/data').get(function (req, res, next) {

  // Examining the container.
  var container = docker.getContainer(req.params.instanceId);

  container.inspect(goOn);

  function goOn(err, data) {

    if (err) { return next(err); }

    // Split the instance name.
    var splittedName = data.Name.split('/');

    // The path to the data folder.
    // splittedName[1] is the instance technical name.
    var dir = cfg.dataInstancesPath + '/' + splittedName[1] + '/data';

    // The object we will return which contains the information.
    var results = {};

    // Get the number of files in the data folder of the instance.
    var nbFiles = fs.readdirSync(dir).length;

    // If there are no files in the data folder, we just return results as an empty object.
    if (nbFiles == 0) {
      return res.status(200).send(results);
    }

    // For each file in the data folder :
    // - We get information on it.
    // - We store them into result.
    // - We eventually store result into results.
    // - We return results.
    fs.readdirSync(dir).forEach(function(file) {

      // fs.stat to get some information on the file.
      fs.stat(dir+'/'+file, function(err, stat) {

        if (err) { return next(err); }

        // The Magic module allows to get the file Mime type.
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(dir+'/'+file, function(err, resu) {

          if (err) throw err;

          nbFiles--;

          var result = {};
          result.name = file;
          result.size = filesize(stat.size);
          result.mimeType = resu;
          results[result.name] = result;

          if (nbFiles == 0) {
            return res.status(200).send(results);
          }

        });

      });

    });

  }

});



// Route to delete a specific data file from a specific instance data folder.
router.route('/-/v1/instances/:containerId/:fileName').delete(function (req, res, next) {

  // Examining the container.
  var container = docker.getContainer(req.params.containerId);

  container.inspect(function (err, data) {

    if (err) { return next(err); }

    // Split the instance name.
    var splittedName = data.Name.split('/');

    // Delete the file.
    // splittedName[1] is the instance technical name.
    rimraf(
      cfg.dataInstancesPath + '/' + splittedName[1] + '/data/' + req.params.fileName
    , function (err) {

      if (err) { return next(err); }

      res.status(200).send('Data File Deleted.');

    });

  });

});



// Route to get information on total size allowed and free disk space.
router.route('/-/v1').get(function (req, res, next) {

  disk.check('/', function(err, info) {

    if (err) { return new Error(err); }

    var result = {};

    // Get the free disk space.
    result.freeDiskSpace = info.free;

    return res.status(200).send(result);

  });

});





/**
 * Creates a new application (docker pull)
 */
router.route('/-/v1/app').post(bodyParser(), function (req, res, next) {

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



router.route('/-/v1/app/:imageId').delete(function (req, res, next) {

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