/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , bodyParser = require('body-parser')
  , moment = require('moment')
  // , util = require('util')
  , fs = require('fs')
  , getSize = require('get-folder-size')
  , filesize = require('filesize')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , exec = require('child_process').exec
  , jsonfile = require('jsonfile')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , fileExists = require('file-exists');

jsonfile.spaces = 2;

module.exports = function (router, core) {

  router.route('/').get(function (req, res, next) {
    return res.render('template.html');
  });

  router.route('/-/v1/instances').get(function (req, res, next) {
    var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
    docker.listContainers({all : true}, function (err, containers) {
      if (err) { return next(err); }

      var arrayObject = [];
      (function check () {

        var elements = containers.pop()
          , container = {};

        if (!elements) { return res.status(200).send(arrayObject); }

        var splittedName = elements.Names[0].split('/');

        if (instancesArray.indexOf(splittedName[1]) === -1) {
          return check();
        }

        var img = docker.getImage(elements.Image);

        jsonfile.readFile(path.join(__dirname, '../manifests/', splittedName[1] + '.json')
        , function (err, obj) {

          if (err) { return next(err); }

          img.inspect(function (err, data) {
            if (err) { return next(err); }

            if (elements.State === 'running') {
              container['status'] = true;
              container['address'] =
                'http://'+process.env.EZMASTER_PUBLIC_IP+':'+elements.Ports[0].PublicPort;
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

            container['longName'] = obj.longName;
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
      if (err) { return next(err); }

      if (req.body.action == 'start' && data.State.Running == false) {
        container.start(function (err, datas, container) {
          if (err) { return next(err); }
          res.status(200).send('Starting done');
        });
      }
      else if (req.body.action == 'stop' && data.State.Running == true) {
        container.stop(function (err, datas, container) {
          if (err) { return next(err); }
          res.status(200).send('Stoping done');
        });
      }
      else if (req.body.action == 'updateConfig') {
        var splittedName = data.Name.split('/');

        jsonfile.writeFile(
          path.join(__dirname, '../instances/', splittedName[1], '/config/data.json'),
          req.body.newConfig, function (err) {
         
          if (err) { return next(err); }

          if (data.State.Running == true) {
            container.restart(function (err) {
              if (err) { return next(err); }
              res.status(200).send('Update done'); 
            });
          }
          else { res.status(200).send('Update done'); }
        });
      }
    });
  });

  router.route('/-/v1/instances/verif').get(bodyParser(), function (req, res, next) {
    if (fileExists(
    path.join(__dirname, '../manifests/'+req.query.technicalName+'.json')) == false) {
      res.status(200).send('Technical name does not exists');
    }
    else {
      res.status(409).send('Technical name '+req.query.technicalName+' already exists');
    }
  });

  router.route('/-/v1/instances/:containerId').get(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { return next(err); }

      var splittedName = data.Name.split('/');

      if (req.query.action == 'info') {
        var directoryDatas = path.join(__dirname, '../instances/', splittedName[1], '/data/')
          , result = {};

        getSize(directoryDatas, function (err, size) {
          if (err) { return next(err); }

          result['technicalName'] = splittedName[1];
          result['size'] = filesize(size);
          return res.status(200).send(result);
        });
      }
      else if (req.query.action == 'config') {
        jsonfile.readFile(
        path.join(__dirname, '../instances/', splittedName[1], '/config/data.json'),
        function (err, obj) {

          if (err) { return next(err); }
          return res.status(200).send(obj);
        });
      }
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
      , study = req.body.study;

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
      docker.pull(image, function (err, stream) {
        if (err) { return res.status(400).send(err); }

        docker.modem.followProgress(stream, onFinished);

        function onFinished(err, output) {
          if (err) { return res.status(400).send(err); }

          mkdirp(path.join(__dirname, '../instances/'+technicalName+'/config/'), function (err) {
            if (err) { return next(err); }

            mkdirp(path.join(__dirname, '../instances/'+technicalName+'/data/'), function (err) {
              if (err) { return next(err); }

              fs.appendFile(
              path.join(__dirname, '../instances/'+technicalName+'/config/data.json')
              , '{}', function (err) {

                if (err) { return next(err); }

                var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
                
                docker.listContainers({all : true}, function (err, containers) {
                  if (err) { return next(err); }

                  var portMax = 0
                    , freePortSplitted = process.env.EZMASTER_FREE_PORT_RANGE.split('-');

                  (function checkPort() {
                    var element = containers.pop();

                    if (element) {
                      var splittedName = element.Names[0].split('/');
                      if (instancesArray.indexOf(splittedName[1]) === -1) {
                        return checkPort();
                      }

                      var container = docker.getContainer(element.Id);

                      container.inspect(function (err, data) {
                        if (err) { return next(err); }

                        var keys =  Object.keys(data.HostConfig.PortBindings)
                          , currentPort = data.HostConfig.PortBindings[keys[0]][0].HostPort;

                        if (currentPort >= portMax) { portMax = parseInt(currentPort) + 1; }
                        return checkPort();
                      });
                    }
                    else {
                      if (portMax == 0) { portMax = freePortSplitted[0]; }

                      var cmd = 'docker run -d -p '+portMax+':3000 ' + 
                      '-e http_proxy -e https_proxy -e EZMASTER_MONGODB_HOST_PORT '+
                      '--net=ezmaster_default --link ezmaster_db '+
                      '-v '+process.env.EZMASTER_PATH+'/instances/'+technicalName+'/config/data.json:'+'/root/data.json '+
                      '-v '+process.env.EZMASTER_PATH+'/instances/'+technicalName+'/data/:/root/data/ '+
                      '--name '+technicalName+' '+image;

                      var newlongName = {
                        'longName' : longName
                      }
                      jsonfile.writeFile(
                        path.join(__dirname, '../manifests/'+technicalName+'.json')
                        , newlongName, function (err) {

                        if (err) { return next(err); }
                      });

                      exec(cmd, function (err, stdout, stderr) {
                        if (err) { return next(err); }
                        return res.status(200).send('Instance created');
                      });
                    }
                  })();
                });
              });
            });
          });
        }
      });
    }
  });

};
