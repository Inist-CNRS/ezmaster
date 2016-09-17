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
  , expect = require('chai').expect;

// build localy the fakeapp ezmaster
// image befor all the tests
before(function (done) {

  this.timeout(60000);

  var cmd = path.join('docker build -t fakeapp-ezmasterized:latest ' +
                      '--build-arg https_proxy --build-arg http_proxy '
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

  // var theInstance = {};
  it('and is found in the ezmaster instance list once created', function (done) {
    supertest('http://127.0.0.1:35267').get('/-/v1/instances/').expect(function (res) {
      expect(res.body).to.have.property('fakeapp-ezmasterized');
      expect(res.body['fakeapp-ezmasterized']).to.have.property('publicURL');
      expect(res.body['fakeapp-ezmasterized'].publicURL).to.not.equal('');
      // theInstance = res.body['fakeapp-ezmasterized'];
    })
    .end(done);

  });

  it('and the app has a specific /etc/ezmaster.json', function (done) {
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
        done(err);
      });

    });
  });

  it('the default config.json is correctly filled', function (done) {
    instance.getInstanceInternalIp('fakeapp-ezmasterized', function (err, ip) {
      if (err) return done(err);
      var url = 'http://' + ip + ':3333';
      supertest(url).get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).to.equals('{"myparam":"myvalue"}');
        done();
      });

    });
  });

  it('the default data folder is correctly filled', function (done) {
    instance.getInstanceInternalIp('fakeapp-ezmasterized', function (err, ip) {
      if (err) return done(err);
      var url = 'http://' + ip + ':3333';
      supertest(url).get('/data/hello.csv')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).to.equals('hello,world');
        done();
      });

    });
  });

  it('should get the ad hoc environment variables', function (done) {
    instance.getInstanceInternalIp('fakeapp-ezmasterized', function (err, ip) {
      if (err) return done(err);
      var url = 'http://' + ip + ':3333';
      supertest(url)
      .get('/env')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const env = JSON.parse(res.text);
        expect(typeof env).to.equal('object');
        expect(env.EZMASTER_TECHNICAL_NAME).to.equal('fakeapp-ezmasterized');
        expect(env.EZMASTER_LONG_NAME).to.equal('Test an ezmasterized fakeapp instance');
        expect(env.EZMASTER_APPLICATION).to.equal('fakeapp-ezmasterized:latest');
        expect(env.DEBUG).to.exist;
        expect(env.http_proxy).to.exist;
        expect(env.https_proxy).to.exist;
        expect(env.no_proxy).to.exist;
        const expectedURL = process.env.EZMASTER_PUBLIC_DOMAIN ?
          'http://fakeapp-ezmasterized.' + process.env.EZMASTER_PUBLIC_DOMAIN :
          'http://127.0.0.1:3333';
        expect(env.EZMASTER_PUBLIC_URL).to.equal(expectedURL);
        done();
      });
    });
  });

  it('and this instance deleteable', function (done) {
    supertest('http://127.0.0.1:35267')
    .delete('/-/v1/instances/fakeapp-ezmasterized')
    .expect(200, function (err) {
      done(err);
    });
  });

});
