/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
'use strict';

var cfg     = require('../lib/config.js');
var _       = require('lodash');
var express = require('express');
var router  = express.Router();

/**
 * Returns the ezmaster public configuration parameters
 */
router.route('/').get(function (req, res, next) {
  return res.status(200).send(_.pick(cfg, cfg.publicParameters));
});

module.exports = router;