/* global describe, it*/
'use strict';

// Travis run this file while building.
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , request = require('supertest');


//Build the fakeapp image
// Create the container and the manifest file
//Before all the test

request = request('http://127.0.0.1:35267');


describe('Test Image', function () {

  this.timeout(60000);

  it('Create image', function (done) {

    var data = {
      'imageName' : 'hello-world',
      'versionImage' : 'latest'
    };

    request
    .post('/-/v1/app')
    .send(data)
    .expect(200, function (err) {
      done(err);
    });



  });


  it('Found fakeapp', function (done) {
    request.get('/-/v1/app/').expect(function (res) {
      if (!res.body['hello-world:latest']) { throw new Error('Image not found!'); }
    })
    .end(done);

  });


  it('Delete Image', function (done) {

    request
    .delete('/-/v1/app/hello-world')
    .expect(200, function (err) {
      done(err);
    });




  });
});