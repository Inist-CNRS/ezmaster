/* global describe, it, before*/
'use strict';

// Travis run this file while building.
var exec = require('child_process').exec
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , request = require('supertest');


//Build the fakeapp image
// Create the container and the manifest file
//Before all the test
before(function(done) {

  this.timeout(60000);

  var cmd = path.join('docker build -t fakeapp --build-arg https_proxy --build-arg http_proxy '
            , __dirname, '/datasets/fakeapp/');

  exec(cmd, done);


});

request = request('http://127.0.0.1:35267');


describe('Test Fakeapp', function () {

  this.timeout(60000);

  it('Create fakeapp', function (done) {

    var data = {
      'longName' : 'fakeapp',
      'project' : 'test',
      'version' : '',
      'study': 'fakeapp',
      'technicalName' :  'test-fakeapp',
      'app' : 'fakeapp'
    };

    request
    .post('/-/v1/instances')
    .send(data)
    .expect(200, function (err) {
      done(err);
    });



  });


  it('Found fakeapp', function (done) {
    request
    .get('/-/v1/instances/')
    .expect(function (res) {
      if (!res.body['test-fakeapp']) { throw new Error('fakeapp not found!'); }
    })
    .end(done);

  });


  it('Delete fakeapp', function (done) {

    request
    .delete('/-/v1/instances/test-fakeapp')
    .expect(200, function (err) {
      done(err);
    });




  });
});