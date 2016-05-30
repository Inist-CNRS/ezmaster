/* global describe, it */
'use strict';
var assert = require('chai').assert
	, request = require('supertest')
	, path = require('path');

describe('the ezmaster application', function () {

  request = request('http://127.0.0.1:3000');

  describe('GET', function () {
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
