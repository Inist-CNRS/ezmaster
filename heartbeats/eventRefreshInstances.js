
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

  //console.log('########## LAUNCH HEART REFRESH INSTANCES ##########');

  var socket;

  // Caching the instances list to have a reference for comparisons to come.
  var cacheInstances = {};



  // ON EACH EVENT CALL.

  return function (heartbeat, last) {

    // console.log('########## HEART EVENT REFRESH INSTANCES ##########');

    // We want to take the castor.config socket variable.
    // This variable may not has been fed in server.js when we want to take it here.
    // As a consequence, we check if it's ok.
    // if not ok : we just return in order to stop the event.
    // The next event call will do this test again and continue if socket is ok.
    // To sum up : we wait until the socket is ok.
    if (!socket) {
      socket = core.config.get('socket');

      if (!socket) {
        // console.log('########## NO SOCKET ##########');
        return;
      }
    }

    // false for instancesChangesBool because here, we just need to get the getInstances() cache.
    instances.getInstances(false, function(err, beatInstances) {

      if (err) { return new Error(err); }

      // If there are some differences between cacheInstances (reference)
      // and beatInstances (just get) :
      // Update cacheInstances with beatInstances.
      // Broadcast to all clients this new version to :
      //  - update the 'containers' variable
      //  - refresh the table.js component
      // This is the table.js component which receives the emit message.
      if (!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances))) {

        cacheInstances = beatInstances;
        //socket.broadcast.emit('refreshInstances', beatInstances);
        socket.emit('refreshInstances', beatInstances);

      }

    });

  };

};