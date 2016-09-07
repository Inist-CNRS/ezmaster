/* global describe, it, before*/
'use strict';

// Travis run this file while building.
var exec = require('child_process').exec
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , supertest = require('supertest')
  , request = require('request')
  , expect = require('chai').expect;

// build localy the fakeapp ezmaster
// image befor all the tests
before(function (done) {

  this.timeout(60000);

  var cmd = path.join('docker build -t fakeapp-ezmasterized:latest --build-arg https_proxy --build-arg http_proxy '
            , __dirname, '/datasets/fakeapp-ezmasterized/');

  exec(cmd, done);

});

supertest = supertest('http://127.0.0.1:35267');

describe('The ezmasterized fakeapp', function () {

  this.timeout(60000);

  it('is able to be created as a ezmaster instance', function (done) {

    var data = {
      'longName' : 'Test an ezmasterized fakeapp instance',
      'project' : 'fakeapp',
      'study': 'ezmasterized',
      'version' : '',
      'technicalName' :  'fakeapp-ezmasterized',
      'app' : 'fakeapp-ezmasterized:latest'
    };

    supertest
    .post('/-/v1/instances')
    .send(data)
    .expect(200, function (err) {
      done(err);
    });



  });

  var theInstance = {};
  it('and is found in the ezmaster instance list once created', function (done) {
    supertest.get('/-/v1/instances/').expect(function (res) {
      theInstance = res.body['fakeapp-ezmasterized'];
      if (!res.body['fakeapp-ezmasterized']) { throw new Error('fakeapp-ezmasterized not found!'); }
    })
    .end(done);

  });

  it('and has a running http server connected to the created instance', function (done) {
    request.get(theInstance.publicURL, function (err, res, body) {
      if (err) return done(err);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('wrong header');
      done(err);
    });
  });

  it('and this instance is able to be deleted', function (done) {

    supertest
    .delete('/-/v1/instances/fakeapp-ezmasterized')
    .expect(200, function (err) {
      done(err);
    });
  });
  
});