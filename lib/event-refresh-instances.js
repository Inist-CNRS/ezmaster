/**
 * Periodical task to refresh the ezmaster instances status
 * the data are communicated through websocket to the client
 */

'use strict';

var cfg = require('./config.js');
var instances = require('./instances.js');
var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('ezmaster:heartbeat:' + basename);

module.exports = function (heartbeat, last) {
  if (!cfg.socket) {
    return;
  }
  instances.refreshInstances();
};