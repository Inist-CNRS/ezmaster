
// This file is the app starting point.
// It launches the server contained in the 'server' variable.

/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/

'use strict';

// To have docker messages with beautiful colors on console.
var kuler = require('kuler');

// var heartbeats = require('heartbeats');

// var instances = require('./helpers/instances');

var serverHeart = require('./helpers/serverHeart');

// config : variable containing app configuration elements.
// start : callback function declared a bit later.
module.exports = function(config, start) {

  // App configuration initialisation before web server launch.
  config.set('theme', __dirname);
  config.set('timeout', 1E6);

  // Web server launch.
  // err : to catch errors.
  // If all good, the 'server' variable contains the server.
  start(function online(err, server) {

    // Use socket.io on the server.
    var io = require('socket.io').listen(server);

    // Bool to check if a heart has already been created on the server.
    var heartAlreadyCreated = false;

    // Caching the instances list to have a reference for comparisons to come.
    var cacheInstances = {};

    // When a user connects to the server.
    io.sockets.on('connection', function (socket){

        // If no heart already created on the server, we create one and the bool becomes true.
        if(!heartAlreadyCreated) {

          heartAlreadyCreated = true;

          serverHeart.serverHeart(cacheInstances, socket);


        }


    });


    if (err instanceof Error) {
      console.error(kuler('Unable to init the server.', 'red'), kuler(err.toString(), 'orangered'));
      process.exit(3);
      return;
    }
    var pack = config.get('package');
    if (pack) {
      console.info(kuler('App detected.', 'olive'), kuler(pack.name
        + ' ' + pack.version, 'limegreen'));
    }
    console.info(kuler('Server is listening.', 'olive'),  kuler(config.get('baseURL')
      + '/', 'limegreen'));

  });
};