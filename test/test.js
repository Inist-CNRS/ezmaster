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