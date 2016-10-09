/**
 * Periodical task to refresh the loadaverage, cpu and ram client side
 * the data are communicated through websocket to the client
 */

'use strict';

var cfg        = require('../lib/config.js');
var os         = require('os');
var filesize   = require('filesize');
var numCPUs    = require('num-cpus');
var disk       = require('diskusage');
var path       = require('path');
var basename   = path.basename(__filename, '.js');
var debug      = require('debug')('ezmaster:heartbeat:' + basename);

module.exports = function (heartbeat, last) {

  // do nothing if the websocket is not yet connected
  if (!cfg.socket) {
    return;
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
  // RAM use percentage.
  numberOfDecimalNumbers = 0;
  infosMachine.useMemoryPercentage = (((os.totalmem() - os.freemem()) * 100) /
      os.totalmem()).toFixed(numberOfDecimalNumbers);

  // CPUs number
  infosMachine.nbCPUs = numCPUs;

  // Disk information
  disk.check(cfg.dataInstancesPath + '/..', function(err, info) {

    if (err) { return new Error(err); }

    infosMachine.freeDisk = filesize(info.free);
    infosMachine.totalDisk = filesize(info.total);
    infosMachine.useDiskPercentage = (((info.total - info.free) * 100) /
      info.total).toFixed(numberOfDecimalNumbers);
  });


  // Broadcast to all users the machine information to :
  //  - update the 'infosMachine' variable
  //  - refresh the infosMachineTable.js component
  // This is the infosMachineTable.js component which receives the emit message.
  cfg.socket.broadcast.emit('refreshInfosMachine', infosMachine);

  // When we come on the web page, while testing in local,
  // machine info are not displayed, we have to refresh the page for that.
  // In local, our pc is the server.
  // The emit.broadcast sends a message to ALL clients except the sender,
  // so our pc doesn't receive the message because it sends it.
  // On the vilodex, obviously no issue because the server broadcast
  // to all clients and our pc is not the sender so it receives the message.
  // To solve this local testing problem we add a simple emit which sends
  // a message to the current client who just connect to the server.
  // As a consequence, this line can be commented when the code is deployed on the vilodex.
  cfg.socket.emit('refreshInfosMachine', infosMachine);

};