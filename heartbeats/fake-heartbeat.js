'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('castor:heartbeat:' + basename)
  ;

module.exports = function(options, core) {
  options = options || {};

  // at the launch
  debug('on the launch');

  // at each beat
  return function (heartbeat, last) {
    debug('on the beat');
  };
};

