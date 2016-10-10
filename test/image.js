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

  this.timeout(90000);

  it('Create image', function (done) {

    var data = {
      'imageName' : 'hello-world',
      'versionImage' : 'latest',
      'imageHub' : ''
    };

    request
    .post('/-/v1/app')
    .send(data)
    .expect(200, function (err) {
      done(err);
    });



  });


  it('Found Image', function (done) {
    request.get('/-/v1/app/').expect(function (res) {
      setTimeout(function() {
        if (!res.body['hello-world:latest']) { throw new Error('Image not found!'); }
      }, 3000);
    })
    .end(done);

  });


  it('Delete Image', function (done) {

    var nameToDelete = new Buffer('hello-world:latest').toString('base64');

    request
    .delete('/-/v1/app/'+nameToDelete)
    .expect(200, function (err) {
      done(err);
    });




  });
});