'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  ;

var bodyParser = require('body-parser');
var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });

const util = require('util');
const fs = require('fs');

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
       /*containers.forEach(function (containerInfo) {
        var container = docker.getContainer(containerInfo.Id);
        container.inspect(function(err, data) {
          if(err) console.info(err);
          console.info(data)
        });
      });*/
      res.render("template.html", {
        containers : containers.filter(function (elements) {
          var element = elements.Names[0].split('/');
          if(instancesArray.indexOf(element[1]) == 0) {
            elements.Names[0] = element[1];
            var d = new Date(elements.Created);
            elements.Created = d.getFullYear() + '/' + d.getMonth()+1 + '/' + d.getDay();
            return element[1];
          }
        })
      });
    });
  });

  router.route('/-/start').post(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.start(function (err, data, container) {
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

  router.route('/-/stop').post(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.stop(function (err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
    });
    // send status in web client
    /*container.inspect(function(err, data) {
      if(err) { 
        console.info(err);
        throw (err);
      }
      console.info(data)
    });*/
  });

  router.route('/-/delete').post(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.stop(function (err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
    });
    container.remove(function (err, data, container) {
      if(err) {
        console.info(err);
        throw (err);
      }
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