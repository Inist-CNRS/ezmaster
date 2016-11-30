/* global describe, it */
'use strict';

var dusage = require('../lib/diskusage.js');
var expect = require('chai').expect;

describe('the ezmaster diskusage lib', function () {

  it('should be able to return JSON data', function (done) {

    dusage(function (err, result) {
      if (err) return done(err);
      
      expect(result).to.have.property('freeDiskRaw');
      expect(result).to.have.property('totalDiskRaw');
      expect(result).to.have.property('freeDisk');
      expect(result).to.have.property('totalDisk');
      expect(result).to.have.property('useDiskPercentage');
      expect(result).to.have.property('fsIsAlmostFilled');

      done();
    });
    
  });

});