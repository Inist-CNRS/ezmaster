
// Ce fichier est le point d'entrée de l'application.
// Il permet de lancer le serveur web contenu dans la variable server.

/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/


'use strict';

// To have docker messages with beautiful colors on console.
var kuler = require('kuler');
//var heartbeats = require('heartbeats');
//var instances = require('./helpers/instances');

// config : variable contenant tous les éléments de la configuration de l'application.
// start : fonction de callback définie un peu plus bas.
module.exports = function(config, start) {

  // Initialisation de la configuration de l'application avant le lancement du serveur web.
  config.set('theme', __dirname);
  config.set('timeout', 1E6);

  // Démarrage du serveur web.
  // Récupération d'une éventuelle erreur dans err.
  // Récupération du serveur web dans la variable server si ça s'est bien passé.
  start(function online(err, server) {

    // Use socket.io on the server.
    /*var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket){

      // HEARTBEAT
      // repeat every 1000 millisecond = every 1 second
        var heart_1 = heartbeats.createHeart(1000);
        // repeat:0 for infinite repeat
        heart_1.createEvent(1, {repeat : 0}, function(heartbeat, last){

          // Instructions effectuées à chaque battement.
            console.log("########## BEAT ! ##########");
            instances.getInstances(function(err,data){

              socket.broadcast.emit('message type : refresh_instances_on_off', data);

              // Plus qu'a récup data sur le template
              //et à traiter les instances une par une pour actualiser leur état.

            });
        });
    });
*/


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