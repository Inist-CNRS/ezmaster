
// Ce fichier est le point d'entrée de l'application.
// Il permet de lancer le serveur web contenu dans la variable server.

/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/


'use strict';

// To have docker messages with beautiful colors on console.
var kuler = require('kuler'); 

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

    // On utilise socket.io sur le serveur.
    var io = require('socket.io').listen(server);
    
    // TEST : Quand un client se connecte.
    io.sockets.on('connection', function (socket) {
      config.set('socket', socket);
      
      /*
      // On envoie un message de type message_welcome au client : /views/template.html
      var message = "Welcome";
      socket.emit('message', message);
      */

    });

    if (err instanceof Error) {
      console.error(kuler("Unable to init the server.", "red"), kuler(err.toString(), 'orangered'));
      process.exit(3);
      return;
    }
    var pack = config.get('package');
    if (pack) {
      console.info(kuler('App detected.', 'olive'), kuler(pack.name + ' ' + pack.version, 'limegreen'));
    }
    console.info(kuler('Server is listening.', 'olive'),  kuler(config.get('baseURL') + "/", "limegreen"));
  
  });
};