/* global describe, it */
'use strict';

var dusage = require('../lib/diskusage.js');
var expect = require('chai').expect;

describe('the ezmaster diskusage lib', function () {

  it('should be able to return JSON data', function (done) {

    dusage(function (err, result) {
      if (err) return done(err);

      expect(result).to.have.property('fsIsAlmostFilled');
      expect(result).to.have.property('diskApp');
      expect(result).to.have.property('diskDocker');
      expect(result.diskApp).to.have.property('freeDiskRaw');
      expect(result.diskApp).to.have.property('totalDiskRaw');
      expect(result.diskApp).to.have.property('freeDisk');
      expect(result.diskApp).to.have.property('totalDisk');
      expect(result.diskApp).to.have.property('useDiskPercentage');
      expect(result.diskDocker).to.have.property('freeDiskRaw');
      expect(result.diskDocker).to.have.property('totalDiskRaw');
      expect(result.diskDocker).to.have.property('freeDisk');
      expect(result.diskDocker).to.have.property('totalDisk');
      expect(result.diskDocker).to.have.property('useDiskPercentage');

      done();
    });

  });

});