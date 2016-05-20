/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , bodyParser = require('body-parser')
  , moment = require('moment')
  , util = require('util')
  , fs = require('fs')
  , getSize = require('get-folder-size')
  , filesize = require('filesize')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , exec = require('child_process').exec
  , jsonfile = require('jsonfile')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , freeport = require('freeport')
  , fileExists = require('file-exists');

jsonfile.spaces = 2;

module.exports = function (router, core) {

  router.route('/').get(function (req, res, next) {
    return res.render('template.html');
  });

  router.route('/-/v1/instances').get(function (req, res, next) {
    var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
    docker.listContainers({all : true}, function (err, containers) {

      var arrayObject = [];

      (function check() {

        var elements = containers.pop()
          , container = {};

        if (!elements) { return res.send(arrayObject); }

        var splittedName = elements.Names[0].split('/');

        if (instancesArray.indexOf(splittedName[1]) === -1) { 
          return check(); 
        }

        var img = docker.getImage(elements.Image);

        jsonfile.readFile(path.join(__dirname, '../manifests/', splittedName[1] + '.json'), function (err, obj) {
          if (err) { return next (err); }

          img.inspect(function (err, data) {
            if (err) { return next (err); }

            if (elements.State === 'running') {
              container['status'] = true;
              container['address'] = 'http://127.0.0.1:' + elements.Ports[0].PublicPort;
              container['target'] = 'ezmaster';
            }
            else if (elements.State === 'exited') {
              container['status'] = false;
              container['address'] = '';
              container['target'] = '';
            }

            elements.Image = data.RepoTags[0];
            elements.Names[0] = splittedName[1];
            elements.Created = moment.unix(elements.Created).format('YYYY/MM/DD');

            container['title'] = obj.title;
            container['description'] = elements;

            arrayObject.push(container);

            check();
          });
        });
      })();
    });
  });

  router.route('/-/v1/instances/:containerId').put(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { return next (err); }
      
      if (req.body.action == 'start' && data.State.Running == false) {
        container.start(function (err, datas, container) {
          if (err) { return next (err); }
          res.send(200);
        });
      }
      else if (req.body.action == 'stop' && data.State.Running == true) {
        container.stop(function (err, datas, container) {
          if (err) { return next (err); }
          res.send(200);
        });
      }
      else if (req.body.action == 'updateConfig') {
        var splittedName = data.Name.split('/');

        jsonfile.writeFile(path.join(__dirname, '../instances/', splittedName[1], '/config/data.json'), req.body.newConfig, function (err) {
          if (err) { return next (err); }

          if (data.State.Running == true) {
            container.restart(function (err) {
              if (err) { return next (err); }
              res.send(200); 
            });
          }
          else { res.send(200); }
        });
      }
    });
  });

  router.route('/-/v1/instances/:containerId/info').get(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { return next (err); }

      var splittedName = data.Name.split('/')
        , directoryDatas = path.join(__dirname, '../instances/', splittedName[1], '/data/')
        , result = {};

      getSize(directoryDatas, function (err, size) {
        if (err) { return next (err); }

        result['technicalName'] = splittedName[1];
        result['size'] = filesize(size);
        res.send(result);
      });
    });
  });

  router.route('/-/v1/instances/:containerId/config').get(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { return next (err); }

      var splittedName = data.Name.split('/');

      jsonfile.readFile(path.join(__dirname, '../instances/', splittedName[1], '/config/data.json'), function (err, obj) {
        if (err) { return next (err); }
        res.send(obj);
      });
    });
  });

  router.route('/-/v1/instances/:containerId').delete(function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { return next (err); }

      if (data.State.Running == true) {
        container.stop(function (err, datas, cont) {
          if (err) { return next (err); }

          container.remove(function (err, datas, cont) {
            if (err) { return next (err); }
          });
        });
      }
      else if (data.State.Running == false) {
        container.remove(function (err, datas, cont) {
          if (err) { return next (err); }
        });
      }

      var splittedName = data.Name.split('/');
      rimraf(path.join(__dirname, '../instances/', splittedName[1]), function (err) {
        if (err) { return next (err); }

        rimraf(path.join(__dirname, '../manifests/', splittedName[1] + '.json'), function (err) {
          if (err) { return next (err); }
          res.send(200);
        });        
      });
    });
  });

  router.route('/-/v1/instances').post(bodyParser(), function (req, res, next) {
    var technicalName = req.body.technicalName
      , title = req.body.title
      , image = req.body.app
      , project = req.body.project
      , version = req.body.version
      , study = req.body.study
      , result = {};

    var concat = project + '-' + study + '-' + version;
    if(title != "" && /^[a-z0-9]+$/.test(project) && /^[a-z0-9]+$/.test(study) && /^[0-9]+$/.test(version) && technicalName == concat) {

      if(fileExists(path.join(__dirname, '../manifests/'+technicalName+'.json')) == false) {
        docker.pull(image, function (err, stream) {
          if (err) { return next (err); }

          docker.modem.followProgress(stream, onFinished, onProgress);

          function onFinished(err, output) {
            if (err) { return next (err); }

            mkdirp(path.join(__dirname, '../instances/'+technicalName+'/config/'), function (err) {
              if (err) { return next (err); }

              mkdirp(path.join(__dirname, '../instances/'+technicalName+'/data/'), function (err) {
                if(err) { return next (err); }

                fs.appendFile(path.join(__dirname, '../instances/'+technicalName+'/config/data.json'), '{}', function (err) {
                  if (err) { return next (err); }

                  freeport(function(err, port) {
                    if(err) { return next (err); }
                    
                    var cmd = 'docker run -d -p '+port+':3000 -e http_proxy -e https_proxy -e MONGODB_URI '+
                    '--net=ezmaster_default --link ezmaster_db '+
                    '-v '+process.env.EZMASTER_PATH+'/instances/'+technicalName+'/config/data.json:'+
                      '/root/data.json '+
                    '-v '+process.env.EZMASTER_PATH+'/instances/'+technicalName+'/data/:/root/data/ '+
                    '--name '+technicalName+' '+image;

                    var newTitle = {
                      "title" : title
                    }
                    jsonfile.writeFile(path.join(__dirname, '../manifests/'+technicalName+'.json'), newTitle, function (err) {
                      if (err) { return next (err); }
                    });

                    exec(cmd, function (err, stdout, stderr) {
                      if (err) { return next (err); }
                      result['status'] = 'noExists';
                      res.send(result);
                    });
                  });
                });
              });
            });
          }

          function onProgress(event) {
            console.info(event);
          }
        });
      }
      else {
        result['status'] = 'exists';
        res.send(result);
      }
    }
  });

};