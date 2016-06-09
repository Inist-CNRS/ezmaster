/*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , moment = require('moment')
  //, util = require('util')
  , fs = require('fs')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , jsonfile = require('jsonfile');



module.exports.getInstances = function (req, res, next) {

  var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
  docker.listContainers({all : true}, function (err, containers) {

    if (err) { return next(err); }

    var arrayObject = [];

    (function check () {

      var elements = containers.pop()
      , container = {};

      if (!elements) { return res.status(200).send(arrayObject); }

      var splittedName = elements.Names[0].split('/');

      if (instancesArray.indexOf(splittedName[1]) === -1) { return check(); }

      var img = docker.getImage(elements.Image);

      jsonfile.readFile(path.join(__dirname, '../manifests/', splittedName[1] + '.json')
      , function (err, obj) {

        if (err) { return next(err); }

        img.inspect(function (err, data) {

          if (err) { return next(err); }

          if (elements.State === 'running') {
            container['status'] = true;

            container['address'] = 'http://'+process.env.EZMASTER_PUBLIC_IP
            +':'+elements.Ports[0].PublicPort;

            if (!process.env.EZMASTER_PUBLIC_IP)
              container['address'] = 'http://127.0.0.1:'+elements.Ports[0].PublicPort;

            container['target'] = splittedName[1];
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

};



module.exports.getInstancesReverseProxy = function () {

  var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));

  docker.listContainers({all : true}, function (err, containers) {
        
    var arrayObject = [];

    (function check () {

      var elements = containers.pop();
      var container = {};

      if (!elements) { return arrayObject; }

      var splittedName = elements.Names[0].split('/');

      if (instancesArray.indexOf(splittedName[1]) === -1) { return check(); }

      var img = docker.getImage(elements.Image);

      jsonfile.readFile(path.join(__dirname, '../manifests/', splittedName[1] + '.json')
      , function (err, obj) {

        img.inspect(function (err, data) {

          if (elements.State === 'running') {
            // Only get id and port
            container['id'] = elements.Id;
            container['port'] = elements.Ports[0].PublicPort;
          }
          else if (elements.State === 'exited') {
            // Only get id and port
            container['id'] = elements.Id;
            container['port'] = elements.Ports[0];  
          }

          arrayObject.push(container);
          check();

        });            
      });
    })();
  });
};
