
'use strict';

var instances = require('./instances');
var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('castor:heartbeat:' + basename);

module.exports = function(options, core) {
  options = options || {};

  // At the launch
    console.log('########## LAUNCH HEART REFRESH INSTANCES ##########');

    // Caching the instances list to have a reference for comparisons to come.
    var cacheInstances = {};

    var socket;

  // At each beat
    return function (heartbeat, last) {

        console.log('########## BEAT HEART REFRESH INSTANCES ##########');

        if (!socket) {
          socket = core.config.get('socket');

          if (!socket) {
            console.log('########## NO SOCKET ##########');
            return;
          }
        }


        // THE HEARTBEATS HEART : This one refreshes the instances list on table.js component.

        // Instructions done on each heart beat.

        // Debug
        // console.log("########## BEAT HEART 1 ! ##########");

        // false for instancesChangesBool because here, we just need to get the getInstances() cache.
        instances.getInstances(false, function(err, beatInstances) {

          if (err) { return new Error(err); }

          // If there are some differences between cacheInstances (reference)
          // and beatInstances (just get) :
          // Update cacheInstances with beatInstances.
          // Broadcast to all clients this new version to update
          // the 'containers' variable in template.html and refresh the table.js component.
          if (!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances))) {

            cacheInstances = beatInstances;
            socket.broadcast.emit('refreshInstances', beatInstances);

          }

        });
    };
};