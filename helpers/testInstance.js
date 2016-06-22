/*eslint no-sync: "off"*/

/*'use strict';

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

      // ignore containers having a unknow technical name
      // (ezmaster him self or mongodb or other containers running on the machine)
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


module.exports.getInstancesReverseProxy = function (callback) {

  var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
  

  docker.listContainers({all : true}, function (err, containers) {

    if (err) { return callback(err); }

    var arrayObject = [];



    (function check () {

      var elements = containers.pop();
      var container = {};

      if (!elements) {          

        return callback(null, arrayObject); 
      }

      var splittedName = elements.Names[0].split('/');

      if (instancesArray.indexOf(splittedName[1]) === -1) { return check(); }

      var img = docker.getImage(elements.Image);

      jsonfile.readFile(path.join(__dirname, '../manifests/', splittedName[1] + '.json')
      , function (err, obj) {

        if (err) { return callback(err); }

        img.inspect(function (err, data) {

          if (err) { return callback(err); }

          if (elements.State === 'running') {
            // Only get id and port
            container['id'] = elements.Id;
            container['Names'] = elements.Names;
            container['port'] = elements.Ports[0].PublicPort;
          }
          else if (elements.State === 'exited') {
            // Only get id and port
            container['id'] = elements.Id;
            container['Names'] = splittedName[1];
            container['port'] = elements.Ports[0];
          }

          arrayObject.push(container);
          check();

        });
      });
    })();
  });
};

*/




/*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , moment = require('moment')
  , util = require('util')
  , fs = require('fs')
  , glob = require("glob")
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , jsonfile = require('jsonfile')
  , async = require('async');



  module.exports.getInstances = function (cb) {

    debug("Il est passé par ici");

    async.parallel([

      // get manifest de toutes les instances
      function(cb){  
        debug("Il est passé par 1");
        var arrayTechnicalNames =[];

        glob("manifests/*.json", function(err, files) { // read the folder or folders if you want: example json/**/*.json
          
          if(err) {
            console.log("cannot read the folder, something goes wrong with glob", err);
          }

          files.forEach(function(file) {

            fs.readFile(file, 'utf8', function (err, data) { // Read each file

              if(err) {
                console.log("cannot read the file, something goes wrong with the file", err);
              }

              var data = JSON.parse(data);
              arrayTechnicalNames.push(data.longName)
console.log("Array name: "+util.inspect(arrayTechnicalNames));
            });

          });
          return cb(null,arrayTechnicalNames);

        });
        
      }, 

      // docker.listContainers
      function(cb){
        debug("Il est passé par 2");

        var arrayInstances=[];

        docker.listContainers({all : true}, function (err, containers) {

          containers.forEach(function(data){

            var instance = [];


            instance['technicalName'] = data.Names[0].split('/')[1];
            instance['containerId'] = data.Id;
            instance['dataPath'] = "datapath";
            instance['creationDate'] = moment.unix(data.Created).format('YYYY/MM/DD')
            instance['app'] = data.Image;     

            if (data.State === 'running') {
              instance['running'] = true;
              instance['port'] = data.Ports[0].PublicPort;
            }
            else if (data.State === 'exited') {
              instance['running'] = false;
              instance['port'] = [];
            }

            arrayInstances.push(instance);



          })
console.log("Array Instance: "+util.inspect(arrayInstances));
return cb(null,arrayInstances);
         });


        
        
        
        } 


  ]), function (err, results) {
    debug("Il passera par là");
    // optional callback
    // if pas dans le manifest alors on zap

    // ignore containers having a unknow technical name
    // (ezmaster him self or mongodb or other containers running on the machine)
    //if (arrayTechnicalNames.indexOf(arrayInstances.technicalName) === -1) { return check(); }
    console.log("RESULSTS: "+results);

  };

  }

 