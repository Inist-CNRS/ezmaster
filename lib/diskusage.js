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
    fsIsAlmostFilled: false,
    diskApp: {
      freeDiskRaw:  0,
      totalDiskRaw: 0,
      freeDisk:  '',
      totalDisk: '',
      useDiskPercentage: 0,
      fsIsAlmostFilled: false,
      maxFileCapSize: 0 // the max file size allowed to be uploaded
    },
    diskDocker: {
      freeDiskRaw:  0,
      totalDiskRaw: 0,
      freeDisk:  '',
      totalDisk: '',
      useDiskPercentage: 0,
      fsIsAlmostFilled: false,
      maxFileCapSize: 0 // the max file size allowed to be uploaded
    }
  };

  // retrieve disk information
  disk.check(cfg.dataInstancesPath, function(err, info) {
    if (err) return cb(new Error(err), diskUsage);

    diskUsage.diskApp.freeDiskRaw       = info.free;
    diskUsage.diskApp.totalDiskRaw      = info.total;
    diskUsage.diskApp.freeDisk          = filesize(info.free, {base: 2});
    diskUsage.diskApp.totalDisk         = filesize(info.total, {base: 2});
    diskUsage.diskApp.useDiskPercentage = (((info.total - info.free) * 100) /
                                     info.total).toFixed(0);
    diskUsage.diskApp.fsIsAlmostFilled  = (diskUsage.diskApp.useDiskPercentage >=
                                           cfg.fullFsPercent);
    diskUsage.diskApp.maxFileCapSize    = Math.floor(info.total*(cfg.fullFsPercent/100) -
                                            (info.total-info.available)
                                  );

    disk.check('/etc/hosts', function (err, info2) {
      if (err) return cb(new Error(err), diskUsage);

      diskUsage.diskDocker.freeDiskRaw        = info2.free;
      diskUsage.diskDocker.totalDiskRaw       = info2.total;
      diskUsage.diskDocker.freeDisk           = filesize(info2.free, {base: 2});
      diskUsage.diskDocker.totalDisk          = filesize(info2.total, {base: 2});
      diskUsage.diskDocker.useDiskPercentage  = (((info2.total - info2.free) * 100) /
                                         info2.total).toFixed(0);
      diskUsage.diskDocker.fsIsAlmostFilled   = (diskUsage.diskDocker.useDiskPercentage >=
                                                 cfg.fullFsPercent);
      diskUsage.diskDocker.maxFileCapSize     = Math.floor(info2.total * (cfg.fullFsPercent / 100)-
                                                (info2.total - info2.available)
                                      );
      diskUsage.fsIsAlmostFilled = diskUsage.diskApp.fsIsAlmostFilled ||
                                   diskUsage.diskDocker.fsIsAlmostFilled;

      return cb(null, diskUsage);
    });
  });

};