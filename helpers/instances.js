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
  , fileExists = require('file-exists')
  , instances = require('../helpers/instances');



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
                container['address'] =
                  'http://'+process.env.EZMASTER_PUBLIC_IP+':'+elements.Ports[0].PublicPort;
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

      if (err) { return; }
      
      var arrayObject = [];

      (function check () {

          var elements = containers.pop()
            , container = {};

          if (!elements) { return arrayObject; }

          var splittedName = elements.Names[0].split('/');

          if (instancesArray.indexOf(splittedName[1]) === -1) { return check(); }

          var img = docker.getImage(elements.Image);

          jsonfile.readFile(path.join(__dirname, '../manifests/', splittedName[1] + '.json')
          , function (err, obj) {

            if (err) { return; }

            img.inspect(function (err, data) {

              if (err) { return; }

              if (elements.State === 'running') {
                container['status'] = true;
                container['address'] =
                  'http://'+process.env.EZMASTER_PUBLIC_IP+':'+elements.Ports[0].PublicPort;
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
