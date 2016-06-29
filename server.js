
// This file is the app starting point.
// It launches the server contained in the 'server' variable.

/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/

'use strict';

// To have docker messages with beautiful colors on console.
var kuler = require('kuler');

var heartbeats = require('heartbeats');

var instances = require('./helpers/instances');

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

    var heartAlreadyCreated = false;

    // Caching the instances list to have a reference for comparisons to come.
    var cacheInstances = {};


    io.sockets.on('connection', function (socket){

      if(!heartAlreadyCreated) {



        heartAlreadyCreated = true;



        // THE HEARTBEATS HEART

          // Repeat every 5000 milliseconds = every 5 seconds.
          var heart1 = heartbeats.createHeart(5000);

          // For infinite repeat we use {repeat : 0}.
          heart1.createEvent(1, {repeat : 0}, function(heartbeat, last){

            // Instructions done on each heart beat.

              console.log("########## BEAT ! ##########");

              instances.getInstances(function(err,beatInstances){

                // If there are some differences between cacheInstances (reference) and beatInstances (just get) :
                  // Update cacheInstances with beatInstances.
                  // Broadcast to all users this new version to update the 'containers' variable in template.html.
                if(!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances) )) {

                  cacheInstances = beatInstances;
                  socket.broadcast.emit('refreshInstances', beatInstances);

                }

              });

          });

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