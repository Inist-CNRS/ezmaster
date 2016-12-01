/**
 * Forward ezmaster pertinent docker events through websocket.
 * - start
 * - stop
 * - destroy
 * - die
 */

'use strict';

var path      = require('path');
var basename  = path.basename(__filename, '.js');
var debug     = require('debug')('ezmaster:' + basename);
var emitter   = require('./docker.js').emitter;
var instances = require('./instances.js');

module.exports = {};
module.exports.init = function (io) {
  debug('init');

  //
  // Docker-event message example:
  // { status: 'stop',
  //   id: 'bef5c15238f3950cafb9cebf9ab4bd3cc623ec98a95f02623bb9ebc736e39f0f',
  //   from: 'istex/istex-view:1.3.0',
  //   Type: 'container',
  //   Action: 'stop',
  //   Actor: 
  //    { ID: 'bef5c15238f3950cafb9cebf9ab4bd3cc623ec98a95f02623bb9ebc736e39f0f',
  //      Attributes: { image: 'istex/istex-view:1.3.0', name: 'a-z' } },
  //   time: 1480600121,
  //   timeNano: 1480600121692591000 }
  //

  emitter.on('start',   sendDockerEventToWs);
  emitter.on('stop',    sendDockerEventToWs);
  emitter.on('destroy', sendDockerEventToWs);
  emitter.on('die',     sendDockerEventToWs);

  function sendDockerEventToWs(message) {
    message = Object.assign(message, { technicalName: message.Actor.Attributes.name });

    // ignore docker containers not listed as an ezmaster instance
    instances.getInstancesManifests(function (err, iList) {
      if (iList[message.technicalName]) {
        io.sockets.emit('docker-event', message);
      }
      // else {
      //   debug('Unknown docker container skipped: ', message.technicalName, message.id); 
      // }
    });
  }

};