/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('ezmaster:' + basename)
  , request = require('request')
  , url = require('url')
  ;



var express = require('express');
var router = express.Router();

router.route('/*').get(function (req, res, next) {
  var originalUrl = url.parse(req.originalUrl.replace('/-/v1/hub', '/v2'));

  originalUrl.protocol = 'http';
  originalUrl.host = 'hub.docker.com';

  request.get({
    url : url.format(originalUrl),
  }).pipe(res);

});


module.exports = router;
