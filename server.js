/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/
'use strict';
var ccore = require('castor-core');

module.exports = function(config, start) {
  config.set('theme', __dirname);
  config.set('timeout', 1E6);
  start();
};

if (!module.parent) {
  ccore(module.exports);
}
