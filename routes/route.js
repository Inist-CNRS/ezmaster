'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  ;

var bodyParser = require('body-parser');
var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
var tcpPortUsed = require('tcp-port-used');

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
      console.info(containers);
      res.render("template.html", {
        containers : containers.filter(function(elements) { return elements.Names[0] != '/mongo_db' })
      });
    });
  });

  router.route('/start').post(bodyParser(), function(req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.start(function(err, data, container) {
      if(err)
        console.info(err);
    });
  });

  router.route('/stop').post(bodyParser(), function(req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.stop(function(err, data, container) {
      if(err)
        console.info(err);
    });
  });

  router.route('/delete').post(bodyParser(), function(req, res, next) {
    var container = docker.getContainer(req.body.containerId);
    container.stop(function(err, data, container) {
      if(err)
        console.info(err);
    });
    container.remove(function(err, data, container) {
      if(err)
        console.info(err);
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

}