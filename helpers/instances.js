/*eslint no-sync: "off"*/

'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , moment = require('moment')
  , util = require('utile')
  , fs = require('fs')
  , glob = require("glob")
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , jsonfile = require('jsonfile');



  module.exports.getInstances = function (cb) {


    util.async.parallel([

      // get manifest de toutes les instances
      function(handleManifests){  
        var arrayTechnicalNames =[];

        glob("manifests/*.json", function(err, files) { // read the folder or folders if you want: example json/**/*.json
          
          if(err) {
            console.log("cannot read the folder, something goes wrong with glob", err);
          }
          var i = 1;

          files.forEach(function(file) {


            var technicalName = file.split('/')[1].split('.')[0];

            fs.readFile(file, 'utf8', function (err, data) { // Read each file

              if(err) {
                console.log("cannot read the file, something goes wrong with the file", err);
              }

              var manifest = [];
              var data = JSON.parse(data);
              manifest['longName'] = data.longName;
              manifest['technicalName'] = technicalName;
              arrayTechnicalNames.push(manifest);
              ;
              

              if(i===files.length){
                //console.log("NAMES:"+util.inspect(arrayTechnicalNames));
                handleManifests(null,arrayTechnicalNames);
              }
              i++;
            });

          });
          

        });
        
        
      }, 

      // docker.listContainers
      function(handleContainers){

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
          handleContainers(null,arrayInstances);
         });

        
        
        
        
        } 


  ], function (err, results) {
    // optional callback
    // if pas dans le manifest alors on zap

    // ignore containers having a unknow technical name
    // (ezmaster him self or mongodb or other containers running on the machine)
    //if (arrayTechnicalNames.indexOf(arrayInstances.technicalName) === -1) { return check(); }
    var res=[];

    //console.log(util.inspect(results));

    results[0].forEach (function(data){

      var manifest = data;

      results[1].forEach(function(data){

        var instance = data;

        if (manifest.technicalName === data.technicalName) {

              instance['longName']=manifest.longName;
              res.push(instance);
              
                        
        };
      });   
    });
    return cb(null,res);
  });
}

 