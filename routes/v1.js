/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var cfg = require('../lib/config.js')
  , path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , getSize = require('get-folder-size')
  , filesize = require('filesize')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , exec = require('child_process').exec
  , jsonfile = require('jsonfile')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , fileExists = require('file-exists')
  , instances = require('../lib/instances.js')
  , app = require('../lib/app.js')
  , instancesArray
  , containers
  , portMax
  , freePortSplitted
  , moment = require('moment')
  , mmm = require('mmmagic')
  , Magic = mmm.Magic
  , multer = require('multer')
  , disk = require('diskusage')
  , _ = require('lodash');
jsonfile.spaces = 2;


var express = require('express');
var router = express.Router();

// Route to get information on total size allowed and free disk space.
router.route('/').get(function (req, res, next) {

  disk.check('/', function(err, info) {

    if (err) { return new Error(err); }

    var result = {};

    // Get the free disk space.
    result.freeDiskSpace = info.free;

    return res.status(200).send(result);

  });

});

module.exports = router;