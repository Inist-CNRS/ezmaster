/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
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
  , instances = require('../helpers/instances')
  , app = require('../helpers/app')
  , util = require('utile')
  , instancesArray
  , containers
  , portMax
  , freePortSplitted
  , moment = require('moment')
  , mmm = require('mmmagic')
  , Magic = mmm.Magic;
  ;

// The bool to check if the instances cache is up to date.
var instancesChangesBool = true;

jsonfile.spaces = 2;



module.exports = function (router, core) {



  router.route('/').get(function (req, res, next) {

    return res.render('template.html');

  });



  router.route('/-/v1/app').get(function (req, res, next) {

    app.getApps(function (err, data) {

      if (err) { return next(err); }
      return res.status(200).send(data);

    });

  });



  router.route('/-/v1/instances').get(function (req, res, next) {

    instances.getInstances(instancesChangesBool, function (err, data) {

      if (err) { return next(err); }

      return res.status(200).send(data);

    });

    // instancesChangesBool set to false because the cache is up to date.
    instancesChangesBool = false;

  });



  router.route('/-/v1/instances/start/:containerId').put(bodyParser(), function (req, res, next) {

    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {

      if (err) { return next(err); }

      container.start(function (err, datas, container) {
        if (err) { return next(err); }

        // When an instance is started, we call refreshInstances() to update
        // the instances list cache and socket emit the updated list to all users.
        // The 'core' parameter allows to get the socket object inside refreshInstances().
        instances.refreshInstances(core);

        res.status(200).send('Starting done');

      });

    });
  });



  router.route('/-/v1/instances/stop/:containerId').put(bodyParser(), function (req, res, next) {

    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {

      if (err) { return next(err); }

      container.stop(function (err, datas, container) {
        if (err) { return next(err); }

        // When an instance is stopped, we call refreshInstances() to update the
        // instances list cache and socket emit the updated list to all users.
        // The 'core' parameter allows to get the socket object inside refreshInstances().
        instances.refreshInstances(core);

        res.status(200).send('Stoping done');
      });

    });
  });



  router.route('/-/v1/instances/config/:containerId').put(bodyParser(), function (req, res, next) {

    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {

      if (err) { return next(err); }

      var splittedName = data.Name.split('/');

      jsonfile.writeFile(
        path.join(__dirname, '../instances/', splittedName[1], '/config/config.json'),
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
      // The 'core' parameter allows to get the socket object inside refreshInstances().
      instances.refreshInstances(core);

    });
  });



  router.route('/-/v1/instances/verif/:technicalName').get(bodyParser(), function (req, res, next) {

    if (fileExists(path.join(__dirname, '../manifests/'+req.params.technicalName+'.json'))
    ==false) {
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
      var directoryDatas = path.join(__dirname, '../instances/', splittedName[1], '/data/')
        , result = {};

      getSize(directoryDatas, function (err, size) {

        if (err) { return next(err); }

        result.technicalName = splittedName[1];
        result.size = filesize(size);

        // Get Configuration Information.
        jsonfile.readFile(
        path.join(__dirname, '../instances/', splittedName[1], '/config/config.json'),
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

      var splittedName = data.Name.split('/');
      rimraf(path.join(__dirname, '../instances/', splittedName[1]), function (err) {
        if (err) { return next(err); }

        rimraf(path.join(__dirname, '../manifests/', splittedName[1] + '.json'), function (err) {
          if (err) { return next(err); }

          // When an instance is deleted, we call refreshInstances() to update the
          // instances list cache and socket emit the updated list to all users.
          // The 'core' parameter allows to get the socket object inside refreshInstances().
          instances.refreshInstances(core);

          res.status(200).send('Removing done');
        });
      });
    });


  });



  router.route('/-/v1/instances').post(bodyParser(), function (req, res, next) {

    var technicalName = req.body.technicalName
      , longName = req.body.longName
      , image = req.body.app
      , project = req.body.project
      , study = req.body.study
      ;


    if (/^[a-z0-9]+$/.test(project) == false && project != '' && project != null) {

      return res.status(400).send('Enter a valid project name');

    }


    if (/^[a-z0-9]+$/.test(study) == false && study != '' && study != null) {

      return res.status(400).send('Enter a valid study name');

    }


    if (fileExists(path.join(__dirname, '../manifests/'+req.query.technicalName+'.json')) == true) {

      res.status(409).send('Technical name already exists');

    }
    else {

      docker.pull(image, follow);

    }


    function follow(err, stream) {
      if (err) { return res.status(400).send(err); }

      docker.modem.followProgress(stream, onFinished);

    }


    function onFinished(err, output) {
      if (err) { return res.status(400).send(err); }

      mkdirp(path.join(__dirname, '../instances/'+technicalName+'/config/'), makeDataDirectory);
    }


    function makeDataDirectory(err) {
      if (err) { return next(err); }

      mkdirp(path.join(__dirname, '../instances/'+technicalName+'/data/'), createConfigFile);
    }


    function createConfigFile(err) {
      if (err) { return next(err); }

      fs.appendFile(
        path.join(
          __dirname, '../instances/'+technicalName+'/config/config.json'
        )
        , '{}'
        , readInstances
      );
    }


    function readInstances(err) {
      if (err) { return next(err); }

      instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));

      docker.listContainers({all : true}, createInstance);
    }


    function createInstance(err, containersList) {
      if (err) { return next(err); }

      containers = containersList;

      portMax = 0;
      freePortSplitted = process.env.EZMASTER_FREE_PORT_RANGE.split('-');

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

        var cmd = 'docker run -d -p '+portMax+':3000 ' +
        '-e http_proxy -e https_proxy -e EZMASTER_MONGODB_HOST_PORT '+
        '--net=ezmaster_default --link ezmaster_db '+
        '-v '+process.env.EZMASTER_PATH+'/instances/'+
        technicalName+'/config/config.json:'+'/opt/ezmaster/config/config.json '+
        '-v '+process.env.EZMASTER_PATH+'/instances/'
        +technicalName+'/data/:/opt/ezmaster/data/ '+
        '--name '+technicalName+' '+image;

        var newlongName = {
          'longName' : longName
        };


        jsonfile.writeFile(
          path.join(__dirname, '../manifests/'+technicalName+'.json')
          , newlongName, function (err) {
            if (err) {
              return next(err);
            }
          });

        exec(cmd, refreshAndReturn);
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


    function refreshAndReturn(err, stdout, stderr) {
      if (err) { return next(err); }

      // When an instance is created, we call refreshInstances() to update the
      // instances list cache and socket emit the updated list to all users.
      // The 'core' parameter allows to get the socket object inside
      // refreshInstances().
      instances.refreshInstances(core);

      return res.status(200).send('Instance created');
    }

  }); // End of the route.



  router.route('/-/v1/instances/:instanceId/data').post(bodyParser(), function (req, res, next) {

    /*
    var body = req.body;
    var file = req.body.file;
    var files = req.files;
    console.log("########## PASSAGE ##########");
    console.log("########## REQ : "+req+" ##########");
    console.log(req);
    console.log("########## BODY : "+body+" ##########");
    console.log(body);
    console.log("########## FILE : "+file+" ##########");
    console.log(file);
    console.log("########## FILES : "+files+" ##########");
    console.log(files);
    console.log("########## INSTANCE ID : "+req.params.instanceId+" ##########");
    */

    var container = docker.getContainer(req.params.instanceId);

    container.inspect(function (err, data) {

      if (err) { return next(err); }

      var splittedName = data.Name.split('/');

      var multer = require('multer');
      var storage = multer.diskStorage({
        destination: function (req, file, callback) {
          console.log(file);
          callback(null, './instances/'+splittedName[1]+'/data');
        },
        filename: function (req, file, callback) {

          console.log(file);

          // We upload the file with its original name.
          callback(null, file.originalname);

        }
      });

      var upload = multer({ storage : storage}).single('btnFile');

      upload(req,res,function(err) {
          if(err) {
            return res.end("Error uploading file.");
          }
          //res.end("File is uploaded");

      });

    });

  });



  router.route('/-/v1/instances/:instanceId/data').get(function (req, res, next) {

    console.log("########## INSTANCE ID : "+req.params.instanceId+" ##########");

    var container = docker.getContainer(req.params.instanceId);

    container.inspect(function (err, data) {

      if (err) { return next(err); }

      var splittedName = data.Name.split('/');

      var dir = './instances/'+splittedName[1]+'/data';

      var results = {};

      var nbFiles = fs.readdirSync(dir).length;

      if(nbFiles == 0) {
        return res.status(200).send(results);
      }

      console.log("########## DIR LEN : "+fs.readdirSync(dir).length+" ##########");

      fs.readdirSync(dir).forEach(function(file) {

        fs.stat(dir+'/'+file, function(err, stat) {

          if(err) { return next(err); }

          var magic = new Magic(mmm.MAGIC_MIME_TYPE);
          magic.detectFile(dir+'/'+file, function(err, resu) {

              if (err) throw err;

              nbFiles--;

              var result = {};
              result.name = file;
              result.size = filesize(stat.size);
              result.mimeType = resu;
              results[result.name] = result;

              if(nbFiles == 0) {
                console.log("RETURN !");
                console.log(results);
                return res.status(200).send(results);
              }

          });

        });

      });

    });

  });



  router.route('/-/v1/instances/:containerId/:fileName').delete(function (req, res, next) {

    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { return next(err); }

      var splittedName = data.Name.split('/');

      rimraf(path.join(__dirname, '../instances/'+splittedName[1]+'/data', req.params.fileName), function (err) {
        if (err) { return next(err); }

        res.status(200).send('Data File Deleted.');
      });

    });

  });










// APPLICATION MANAGEMENT


router.route('/-/v1/app').post(bodyParser(), function (req, res, next) {

  var image = req.body.imageName;
  var tag = req.body.versionImage;

  var imageId;



  docker.pull(image, function(err, stream) {



    if (err) { return next(err); }

    docker.modem.followProgress(stream, onFinished, onProgress);

    function onFinished(err, output) {


      if (err) { return res.status(500).send(err); }

       var container = docker.getImage(image);

   container.inspect(function (err, data) {

     if (err) { return next(err); }
     console.log(util.inspect(data));
     var imageName = {
       'imageName' : image+':'+tag,
       'imageId' : data.Id.split(':')[1],
       'creationDate' :  moment(data.Created, moment.ISO_8601).format('YYYY/MM/DD hh:mm:ss')
     };

     jsonfile.writeFile(
       path.join(__dirname, '../applications/'+data.Id.split(':')[1]+'.json')
       , imageName, function (err) {
         if (err) {
           return res.status(500).send(err);
         }else{
           return res.status(200).send(output);
         }
       });
   });


     }

    function onProgress(event) {

     stream.pipe(process.stdout);

    }

  });

});




 router.route('/-/v1/app/:imageId/delete').get(function (req, res, next) {

   var container = docker.getImage(req.params.imageId);

   container.inspect(function (err, data) {

     if (err) { return next(err); }

     var result = {};

     result['imageName'] = data.RepoTags;

     return res.status(200).send(result);

   });

 });



 router.route('/-/v1/app/:imageId').delete(function (req, res, next) {

   var image = docker.getImage(req.params.imageId);

   image.remove(function (err, datas, cont) {

     if (err) { res.status(409); }

     rimraf(path.join(__dirname, '../applications/', req.params.imageId.split(':')[1] + '.json'), function (err) {
         if (err) { return next(err); }

         res.status(200).send('Removing done');
       });

   });

 });





}; // End of module.exports = function (router, core) {