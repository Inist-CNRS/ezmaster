'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , bodyParser = require('body-parser')
  , moment = require('moment')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock' });

const util = require('util')
  , fs = require('fs');

module.exports = function(router, core) {

  var config = core.config
    , mongodb = core.connect();

  /*router.route('/').get(function(req, res, next) {
    mongodb.then(function(db) {
      db.collection('data', function(err, coll) {
        coll.count().then(function(count) {             // MongoDB API see http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#count
          res.render("template.html", {
            name : "World",
            title: config.get('title'),                 // comes from your custom config.local.js
            appVersion: config.get('package.version'),  // comes from package.json
            appName: config.get('package.name'),        // comes from package.json
            fileRoute: 'routes/route.js',
            fileTemplate: 'views/template.html',
            nbDocs: count                               // comes form mongodb with basic query
          });
        })
      })
    }).catch(next);
  });*/

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
          
          var img = docker.getImage(elements.Image)
          , jsonData = require(path.join(__dirname, '../instances', splittedName[1], '/config/data.json'));

        img.inspect(function (err, data) {
          if (err) {
            console.info(err);
            throw err;
          }

          if (elements.State == 'running') { 
            container['status'] = 'status_running'; 
            container['address'] = 'http://127.0.0.1:' + elements.Ports[0].PublicPort;
            container['target'] = 'ezmaster';
          }
          else if (elements.State == 'exited') { 
            container['status'] = 'status_exited';
            container['address'] = '';
            container['target'] = '';
          }

          elements.Image = data.RepoTags[0];
          elements.Names[0] = splittedName[1];
          elements.Created = moment.unix(elements.Created).format("YYYY/MM/DD HH:MM");
                
          container['title'] = jsonData.title;
          container['description'] = elements;

          arrayObject.push(container);

          check();
        });
      })();
    });
  });

  router.route('/-/start').post(bodyParser(), function (req, res, next) {
    var c = docker.getContainer(req.body.containerId);

    c.inspect(function (err, data) {
      if(err) {
        console.info(err);
        throw err;
      }

      if(data.State.Running == false) {
        c.start(function (err, datas, container) {
          if(err) {
            console.info(err);
            throw (err);
          }
          res.send(200);
        });
      }
    });
  });

  router.route('/-/stop').post(bodyParser(), function (req, res, next) {
    var c = docker.getContainer(req.body.containerId);

    c.inspect(function (err, data) {
      if(err) {
        console.info(err);
        throw err;
      }

      if(data.State.Running == true) {
        c.stop(function (err, datas, container) {
          if(err) {
            console.info(err);
            throw (err);
          }
          res.send(200);
        });
      }
    });
  });

  router.route('/-/delete').post(bodyParser(), function (req, res, next) {
    var c = docker.getContainer(req.body.containerId);
    console.info(c);

    c.inspect(function (err, data) {
      if(err) {
        console.info(err);
        throw err;
      }

      if(data.State.Running == true) {
        c.stop(function (err, datas, container) {
          if(err) {
            console.info(err);
            throw (err);
          }
        });
      }
      c.remove(function (err, datas, container) {
        if(err) {
          console.info(err);
          throw (err);
        }
      });
    });
  });

  router.route('/-/addInstance').post(function (req, res, next) {
    docker.createContainer({Image: 'inistcnrs/ezvis', name: 'inistcnrs-ezvis',
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
        'Binds':  [path.join(__dirname, '../instances/inistcnrs-ezvis/data')+':/root/data'
                , path.join(__dirname, '../instances/inistcnrs-ezvis/config/data.json')+':/root/data.json']
      },
      'Volumes': {
        '/root/data': {},
        '/root/data.json' : {}
      }
    },
    function (err, container) {
      container.start(function (err, data) {
        if(err) {
          console.info(err);
          throw err;
        }
        res.send(200);
      });
    });
  });

}