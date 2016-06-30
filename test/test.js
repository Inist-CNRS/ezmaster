/* global describe, it */
'use strict';

// Travis run this file while building.
var request = require('supertest')
  , path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , exec = require('child_process').execSync
  , instances = require('../helpers/instances')
  , fileExists = require('file-exists')
  , assert = require('chai').assert
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});

describe('the ezmaster application', function () {

  request = request('http://127.0.0.1:35267');

  describe('GET', function () {

    this.timeout(5000);

    it('index route', function (done) {
      request.get('/').expect(200, function (err) {
        done(err);
      });
    });

    it('basic route', function (done) {
      request.get('/-/v1/instances').expect(200, function (err) {
        done(err);
      });
    });
  });

});



describe('Run fakeapp', function () {

  var dockerInstances = [];

  var cmd = 'docker run -d -p 60000:3000 ' +
            '-e http_proxy -e https_proxy -e EZMASTER_MONGODB_HOST_PORT '+
            '--net=ezmaster_default --link ezmaster_db '+
            '-v '+process.env.EZMASTER_PATH+'/test'
            +'/datasets/fakeapp/:/opt/ezmaster/data/ '+
            '--name fakeapp fakeapp';

  exec(cmd, function (err, stdout, stderr) {});


   docker.listContainers({ all : true }, function (err, containers) {
       
        containers.forEach(function (data) {
          dockerInstances.push(data.Names[0].split('/')[1]);
        });

    });

  it('Found fakeapp', function (done) {


    var found = false;


      dockerInstances.forEach (function (instance) {
        
        if(instance.toString() == 'fakeapp'){;
          found = true;
        }
      });
      done(assert.equal(found,true));

      var cmd = 'docker rm -f fakeapp';

      exec(cmd, function (err, stdout, stderr) {});


      

  });


  

});