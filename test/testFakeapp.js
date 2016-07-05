/* global describe, it*/
'use strict';

// Travis run this file while building.
var execSync = require('child_process').execSync
  , jsonfile = require('jsonfile')
  , path = require('path')
  , fs = require('fs')
  , request = require('supertest');


//Build the fakeapp image
// Create the container and the manifest file
//Before all the test
before(function() {

  var cmd = 'docker build -t fakeapp --build-arg https_proxy --build-arg http_proxy '
            +__dirname+'/datasets/fakeapp/';

  execSync(cmd);

  //Docker command for creating the container
  var cmd = 'docker run -d -p 60000:3000 ' +
          '-e http_proxy -e https_proxy -e EZMASTER_MONGODB_HOST_PORT '+
          '--net=ezmaster_default --link ezmaster_db '+
          '-v '+process.env.EZMASTER_PATH+'/test'
          +'/datasets/fakeapp/:/opt/ezmaster/data/ '+
          '--name fakeapp fakeapp';

  //Creating the manifest and writting the longName inside
  var newlongName = {
    'longName' : 'fakeapp'
  };

  jsonfile.writeFile(
    path.join(__dirname, '../manifests/fakeapp.json')
    , newlongName, function (err) {
      if (err) { return new Error(err); }
    });

  execSync(cmd);


});


describe('Test fakeapp', function (cb) {


  request = request('http://127.0.0.1:35267');


  it('Found fakeapp', function (done) {

    request.get('/-/v1/instances/').expect(function (res) {
      if (!res.body.fakeapp) { return new Error('fakeapp not found!'); }
    })
    .end(done);



  });


});


//Delete the container and the manifest file after all the test have been done
after(function() {
  var cmd = 'docker rm -f fakeapp';
  execSync(cmd);

  fs.unlink(
    path.join(__dirname, '../manifests/fakeapp.json')
    , function (err) {
      if (err) { return new Error(err); }
    });


});