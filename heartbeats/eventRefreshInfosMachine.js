
// This file is a Heartbeats event script which is executed each x heart beats.
// The x value is specified in the event declaration in castor.config.js.
// This event refreshes the machine information on infosMachineTable.js component.
// This is possible by sending these information with socket to the component infosMachineTable.js listening to messages coming from here.

'use strict';

var os = require('os');
var filesize = require('filesize');
var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('castor:heartbeat:' + basename);

module.exports = function(options, core) {
  options = options || {};

  // On Heart Launch.

    // console.log('########## LAUNCH HEART REFRESH INFOS MACHINE ##########');

    var socket;


  // On each event call.

    return function (heartbeat, last) {

      // console.log('########## HEART EVENT REFRESH INFOS MACHINE ##########');

      // It's possible that the castor.config socket variable has not been fed in server.js when we want to take it here.
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

      // Getting machine information we want to display.
        var infosMachine = {};

        // Returns an array containing the 1, 5, and 15 minutes load averages.
        infosMachine.loadAverage = os.loadavg();

        // Trunc loadAverage values.
        var numberOfDecimalNumbers = 2;
        infosMachine.loadAverage[0] = infosMachine.loadAverage[0].toFixed(numberOfDecimalNumbers);
        infosMachine.loadAverage[1] = infosMachine.loadAverage[1].toFixed(numberOfDecimalNumbers);
        infosMachine.loadAverage[2] = infosMachine.loadAverage[2].toFixed(numberOfDecimalNumbers);

        // os.totalmem() returns the total amount of system memory in bytes.
        infosMachine.totalMemory = filesize(os.totalmem());
        // os.freemem() returns the amount of free system memory in bytes.
        infosMachine.freeMemory = filesize(os.freemem());

      // Broadcast to all users the machine information to update the 'infosMachine' variable and refresh the infosMachineTable.js component.
      // This is the infosMachineTable.js component which receives the emit message.
      socket.broadcast.emit('refreshInfosMachine', infosMachine);

      // When we come on the web page, while testing in local,
      // machine info are not displayed, we have to refresh the page for that.
      // In local, our pc is the server.
      // The emit.broadcast sends a message to ALL clients except the sender,
      // so our pc doesn't receive the message because it sends it.
      // On the vilodex, obviously no issue because the server broadcast
      // to all clients and our pc is not the sender so it receives the message.
      // To solve this local testing problem we add a simple emit which sends
      // a message to all clients.
      // As a consequence, this line can be commented when the code is deployed on the vilodex.
      socket.emit('refreshInfosMachine', infosMachine);

    };

};