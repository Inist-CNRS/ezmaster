'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  ;

var bodyParser = require('body-parser');
var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });

const util = require('util');

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

  router.route('/').get(function(req, res, next) {
    docker.listContainers({all : true}, function (err, containers) {
       /*containers.forEach(function (containerInfo) {
        var container = docker.getContainer(containerInfo.Id);
        container.inspect(function(err, data) {
          if(err) console.info(err);
          console.info(data)
        });
      });*/
      res.render("template.html", {
        containers : containers.filter(function(elements) { return elements.Names[0] != '/mongo_db' })
      });
    });
  });

  router.route('/-/start').post(bodyParser(), function(req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.start(function(err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
    });
    // send status in web client
    /*container.inspect(function(err, data) {
      if(err) console.info(err);
      console.info(data)
    });*/
  });

  router.route('/-/stop').post(bodyParser(), function(req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.stop(function(err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
    });
    // send status in web client
    container.inspect(function(err, data) {
      if(err) { 
        console.info(err);
        throw (err);
      }
      console.info(data)
    });
  });

  router.route('/-/delete').post(bodyParser(), function(req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.stop(function(err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
    });
    container.remove(function(err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
    });
  });

  /*router.route('/addInstance').post(bodyParser(), function(req, res, next) {
    docker.createContainer({Image: req.body.instanceImage, name: req.body.instanceTechnicalName}, function (err, container) {
      container.start(function (err, data) {
        if(err)
          console.log(err);
      });
    });
  });*/

  router.route('/-/addInstance').post(function(req, res, next) {
    docker.run('inistcnrs/ezvis', [], process.stdout, {
      'HostConfig': {
        'Links': ['mongo_db:mongo'],
        "PortBindings": {
          "3000/tcp": [
            {
              "HostIp": "",
              "HostPort": "3001"
            }
          ]
        },
        'Binds':  [path.join(__dirname, '../instances/inistcnrs-ezvis/data')+':/root/data'
                , path.join(__dirname, '../instances/inistcnrs-ezvis/config/data.json')+':/root/data.json']
      },
      "Config": {
        "ExposedPorts": {
          "3000/tcp": {}
        },
        'Volumes': {
          '/root/data': {},
          '/root/data.json' : {}
        },
      },
      "NetworkSettings": {
        "Ports": {
          "3000/tcp": [
            {
              "HostIp": "0.0.0.0",
              "HostPort": "3001"
            }
          ]
        }
      }
    },
    function(err, data, container) {
      if(err) {
        console.info(err);
        throw err;
      }
      /*var lastContainer = docker.getContainer(container);
      console.info('rename');
      lastContainer.rename('inistcnrs-ezvis', function(err, data) {
        if(err) {
          console.info(err);
          throw err;
        }
      });*/
    });
    console.info('test callback');
    res.status(200).end();
  });

}