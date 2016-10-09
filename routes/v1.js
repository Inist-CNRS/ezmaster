/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , jsonfile = require('jsonfile')
  , disk = require('diskusage');
jsonfile.spaces = 2;


var express = require('express');
var router = express.Router();

// Route to get information on total size allowed and free disk space.
router.route('/').get(function (req, res, next) {

  disk.check(cfg.dataInstancesPath + '/..', function(err, info) {

    if (err) { return new Error(err); }

    var result = {};

    // Get the free disk space.
    result.freeDiskSpace = info.free;

    return res.status(200).send(result);

  });

});

module.exports = router;