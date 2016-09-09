/* global describe, it, before*/
'use strict';

// Travis run this file while building.
var exec = require('child_process').exec
  , path = require('path')
  , app = require('../helpers/app.js')
  , instance = require('../helpers/instances.js')
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

describe('The ezmasterized fakeapp', function () {

  this.timeout(60000);

  it('is able to be created as an ezmaster instance', function (done) {

    var data = {
      'longName' : 'Test an ezmasterized fakeapp instance',
      'project' : 'fakeapp',
      'study': 'ezmasterized',
      'version' : '',
      'technicalName' :  'fakeapp-ezmasterized',
      'app' : 'fakeapp-ezmasterized:latest'
    };

    supertest('http://127.0.0.1:35267')
    .post('/-/v1/instances')
    .send(data)
    .expect(200, function (err) {
      done(err);
    });



  });

  var theInstance = {};
  it('and is found in the ezmaster instance list once created', function (done) {
    supertest('http://127.0.0.1:35267').get('/-/v1/instances/').expect(function (res) {
      expect(res.body).to.have.property('fakeapp-ezmasterized');
      expect(res.body['fakeapp-ezmasterized']).to.have.property('publicURL');
      expect(res.body['fakeapp-ezmasterized'].publicURL).to.not.equal('');
      theInstance = res.body['fakeapp-ezmasterized'];
    })
    .end(done);

  });

  it ('and the app has a specific /etc/ezmaster.json', function (done) {
    app.readEzmasterAppConfig('fakeapp-ezmasterized:latest', function (err, conf) {
      if (err) return done(err);
      expect(conf.httpPort).to.equals(3333);
      expect(conf.configPath).to.equals('/fakeapp/config.json');
      expect(conf.dataPath).to.equals('/fakeapp/data/');
      done();
    });
  });

  it('and has a running http server connected to the created instance', function (done) {
    instance.getInstanceInternalIp('fakeapp-ezmasterized', function (err, ip) {
      if (err) return done(err);
      var url = 'http://' + ip + ':3333';
      supertest(url).get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(JSON.stringify(res.body)).to.equals('{}');
        done();
      });

    });
  });

  it('and this instance is able to be deleted', function (done) {

    supertest('http://127.0.0.1:35267')
    .delete('/-/v1/instances/fakeapp-ezmasterized')
    .expect(200, function (err) {
      done(err);
    });
  });
  
});