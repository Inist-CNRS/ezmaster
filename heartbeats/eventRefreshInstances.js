
// This file is a Heartbeats event script which is executed each x heart beats.
// The x value is specified in the event declaration in castor.config.js.
// This event refreshes the instances list on table.js component.
// Done by sending the instances list with socket to the component table.js.
// The component table.js is listening to messages coming from here.

'use strict';

var instances = require('../helpers/instances');
var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('castor:heartbeat:' + basename);

module.exports = function(options, core) {
  options = options || {};

  // ON HEART LAUNCH.

  var socket;


  // ON EACH EVENT CALL.

  return function (heartbeat, last) {

    // We want to take the castor.config socket variable.
    // This variable may not has been fed in server.js when we want to take it here.
    // As a consequence, we check if it's ok.
    // if not ok : we just return in order to stop the event.
    // The next event call will do this test again and continue if socket is ok.
    // To sum up : we wait until the socket is ok.
    if (!socket) {
      socket = core.socket;

      if (!socket) {
        return;
      }
    }
    
    instances.refreshInstances(core);
  };
};