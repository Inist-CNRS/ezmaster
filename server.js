/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/
'use strict';
var ccore = require('castor-core');

module.exports = function(config, start) {
  config.set('theme', __dirname);
  start();
};

if (!module.parent) {
  ccore(module.exports);
}
