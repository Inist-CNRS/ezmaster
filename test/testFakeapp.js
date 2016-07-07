/* global describe, it, before, after*/
'use strict';

// Travis run this file while building.
/*var execSync = require('child_process').exec
  , jsonfile = require('jsonfile')
  , path = require('path')
  , fs = require('fs')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , mkdirp = require('mkdirp')
  , request = require('supertest')
  , Docker = require('dockerode')
  , fileExists = require('file-exists')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});


//Build the fakeapp image
// Create the container and the manifest file
//Before all the test
before(function() {

  var cmd = 'docker build -t fakeapp --build-arg https_proxy --build-arg http_proxy '
            +__dirname+'/datasets/fakeapp/';

  execSync(cmd);


});


describe('Test fakeapp', function () {


  request = request('http://127.0.0.1:35267');

  it('Create fakeapp', function (done) {

    var fakeapp = new Object();

    fakeapp.body= {
      longName: 'fakeapp',
      project: 'test',
      version: '',
      study: 'fakeapp',
      technicalName: 'test-fakeapp',
      app: 'fakeapp'};

    request
    .post('/-/v1/instances/'+fakeapp)
    .expect(200, function (err) {
      done(err);
  });



  });
});

describe('Found fakeapp', function () {

  it('Found fakeapp', function (done) {
    request.get('/-/v1/instances/').expect(function (res) {
      if (!res.body['test-fakeapp']) { return new Error('fakeapp not found!'); }
    })
    .end(done);

  });
});

describe('Delete fakeapp', function () {

  it('Delete fakeapp', function (done) {

    request
    .delete('/-/v1/instances/test-fakeapp')
    .expect(200, function (err) {
      done(err);
    });




  });
});



});*/