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
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});//, timeout:1E7});

const spawn = require('child_process').spawn;

module.exports = function (router, core) {

  var config = core.config
    , mongodb = core.connect();

  router.route('/').get(function (req, res, next) {
    var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
    docker.listContainers({all : true}, function (err, containers) {

      var container = {}
        , arrayObject = [];

      (function check() {
        const elements = containers.pop();
        
        if (!elements) {
          return res.render("template.html", { 
            containers : arrayObject
          });
        }

        var splittedName = elements.Names[0].split('/');

        if (instancesArray.indexOf(splittedName[1]) === -1) { return check(); }
        else { 
          var img = docker.getImage(elements.Image)
          , jsonData = require(path.join(__dirname, '../manifests/', splittedName[1] + '.json'));

          img.inspect(function (err, data) {
            if (err) { throw err; }
            else {
              if (elements.State === 'running') { 
                container['status'] = 'status_running'; 
                container['address'] = 'http://127.0.0.1:' + elements.Ports[0].PublicPort;
                container['target'] = 'ezmaster';
              }
              else if (elements.State === 'exited') { 
                container['status'] = 'status_exited';
                container['address'] = '';
                container['target'] = '';
              }

              elements.Image = data.RepoTags[0];
              elements.Names[0] = splittedName[1];
              elements.Created = moment.unix(elements.Created).format("YYYY/MM/DD");
                    
              container['title'] = jsonData.title;
              container['description'] = elements;

              arrayObject.push(container);

              check();
            }
          });
        }
      }) ();
    });
  });

  router.route('/-/v1/instances/:containerId').put(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if(err) { throw err; }
      else if(req.body.action == 'start' && data.State.Running == false) {
        container.start(function (err, datas, container) {
          if (err) { throw (err); }
          else { res.send(200); }
        });
      }
      else if(req.body.action == 'stop' && data.State.Running == true) {
        container.stop(function (err, datas, container) {
          if (err) { throw (err); }
          else { res.send(200); }
        });
      };
    });
  });

  router.route('/-/v1/instances/:containerId').get(function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { throw err; }
      else {
        var splittedName = data.Name.split('/')
          , directoryDatas = path.join(__dirname, '../instances/', splittedName[1], '/data/')
          , configDatas = require(path.join(__dirname, '../instances/', splittedName[1], '/config/data.json'))
          , result = {};

        getSize(directoryDatas, function (err, size) {
          if (err) { throw err; }
          else {
            result['title'] = configDatas.title
            result['size'] = filesize(size);
            res.send(result);
          }
        });
      }
    });
  });

  router.route('/-/v1/instances/:containerId').delete(function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { throw err; }
      else if (data.State.Running == true) {
        container.stop(function (err, datas, cont) {
          if (err) { throw (err); }
          else {
            container.remove(function (err, datas, cont) {
              if (err) { throw (err); }
              else { res.send(200) }
            });
          }
        });
      }
      else if (data.State.Running == false) {
        container.remove(function (err, datas, cont) {
          if (err) { throw (err); }
          else { res.send(200); }
        });
      }
    });
  });

  router.route('/-/v1/instances').post(function (req, res, next) {
    docker.pull('inistcnrs/ezvis:latest', function (err, stream) {
      if(err) { throw err; }

      docker.modem.followProgress(stream, onFinished);

      function onFinished(err, output) {
        if(err) { throw err; }

        docker.createContainer({Image: 'inistcnrs/ezvis:latest', name: 'inistcnrs-ezvis',
         'HostConfig': {
            'Links': ['mongo_db:mongo'],
            'PortBindings': {
              '3000/tcp': [
                {
                  'HostIp': '',
                  'HostPort': '3001'
                }
              ]
            },
            'Binds':  [path.join(__dirname, '../instances/inistcnrs-ezvis/data')+':/root/data',
                      path.join(__dirname, '../instances/inistcnrs-ezvis/config/data.json')+':/root/data.json']
          },
          'Volumes': {
            '/root/data': {},
            '/root/data.json' : {}
          }
        },
        function (err, container) {
          if(err) { throw err; }

          container.start(function (err, data) {
            if (err) { throw err; }
            res.send(200); 
          });
        });
      }
    });
  });

}