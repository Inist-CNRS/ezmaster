/* global describe, it */
'use strict';
var request = require('supertest');

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
