'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('castor:helpers:' + basename)
  ;


module.exports = function (input)  {
  return String(input).concat('!');
};
