/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , udisk = require('../lib/diskusage.js');


var express = require('express');
var router = express.Router();

// Route to get information on total size allowed and free disk space.
router.route('/').get(function (req, res, next) {

  udisk(function(err, info) {

    if (err) { return new Error(err); }

    var result = {};

    // Get the free disk space.
    result.freeDiskSpace  = info.freeDiskRaw;
    result = Object.assign(info, result);

    return res.status(200).send(result);

  });

});

module.exports = router;