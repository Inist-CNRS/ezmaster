/**
 * Utility to check the diskusage information and
 * prepare result to be used by ezmaster.
 */

'use strict';

var cfg        = require('../lib/config.js');
var disk       = require('diskusage');
var filesize   = require('filesize');
var path       = require('path');
var basename   = path.basename(__filename, '.js');
var debug      = require('debug')('ezmaster:' + basename);

module.exports = function (cb) {

  var diskUsage = {
    freeDiskRaw:  0,
    totalDiskRaw: 0,
    freeDisk:  '',
    totalDisk: '',
    useDiskPercentage: 0,
    fsIsAlmostFilled: false,
    maxFileCapSize: 0 // the max file size allowed to be uploaded
  };

  // retrieve disk information
  disk.check(cfg.dataInstancesPath, function(err, info) {
    if (err) return cb(new Error(err), diskUsage);

    diskUsage.freeDiskRaw       = info.free;
    diskUsage.totalDiskRaw      = info.total;
    diskUsage.freeDisk          = filesize(info.free, {base: 2});
    diskUsage.totalDisk         = filesize(info.total, {base: 2});
    diskUsage.useDiskPercentage = (((info.total - info.free) * 100) /
      info.total).toFixed(1);
    diskUsage.fsIsAlmostFilled  = (diskUsage.useDiskPercentage >= cfg.fullFsPercent);
    diskUsage.maxFileCapSize    = Math.floor(info.total*(cfg.fullFsPercent/100)-(info.total-info.available));

    return cb(null, diskUsage);
  });

};