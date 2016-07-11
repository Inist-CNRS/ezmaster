
// This file is the app starting point.
// It launches the server contained in the 'server' variable.

/*eslint global-require:"warn"*/

'use strict';

// To have docker messages with beautiful colors on console.
var kuler = require('kuler');

var socket = require('socket.io');

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
    var io = socket.listen(server);

    // When a user connects to the server.
    io.sockets.on('connection', function (socket) {

      // Feed the socket variable declared in castor.config.js.
      config.set('socket', socket);

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