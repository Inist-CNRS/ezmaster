/**
 * EzMaster entrypoint
 */

/*eslint global-require:"warn"*/
'use strict';

var cfg   = require('./lib/config.js');
var kuler = require('kuler');
var debug = require('debug')('ezmaster');

var express = require('express');
var app    = express();
var server = require('http').Server(app);
var io     = require('socket.io')(server);
var cors      = require('cors');
var basicAuth = require('basic-auth-connect');

var instances = require('./lib/instances.js');


app.use(cors()); // to allow ezmaster-front to call it from client side

// to secure the API
if (process.env.EZMASTER_USER !== '' && process.env.EZMASTER_PASSWORD !== '') {
  app.use(basicAuth(process.env.EZMASTER_USER, process.env.EZMASTER_PASSWORD));  
}

// connect static ressources located in public folder
app.use(express.static('public'));

// connect the reverse proxy stuff (to be removed in ezmaster 4.0)
app.use(require('./middlewares/reverse-proxy.js'));

// connect the API routes
app.use('/-/v1/',          require('./routes/v1.js'));
app.use('/-/v1/config',    require('./routes/v1-config.js'));
app.use('/-/v1/app',       require('./routes/v1-app.js'));
app.use('/-/v1/hub',       require('./routes/v1-hub.js'));
app.use('/-/v1/instances', require('./routes/v1-instances.js'));

// load socket.io connections
// penser à gérer le multi-utilisateur car la on ne communique qu'au dernier client
io.on('connection', function (socket) {
  cfg.socket = socket;
});
// start listening and forwarding docker events through websocket
require('./lib/docker-websocket.js').init(io);



server.listen(cfg.EZMASTER_PORT, function () {
  console.info(kuler(cfg.package.name + ' ' + cfg.package.version + ' is listening.', 'olive'));
  console.info('EzMaster backoffice:    ' +
               kuler('http://' + cfg.publicIP + ':' + cfg.EZMASTER_PORT + '/', 'limegreen'));
  if (cfg.publicDomain) {
    console.info('EzMaster reverse proxy: ' +
                 kuler('http://*.' + cfg.publicDomain + '/', 'limegreen'));
  }
});

// periodical background task
var heartbeats = require('heartbeats');
var heart = heartbeats.createHeart(1000);
heart.createEvent(5, require('./lib/event-refresh-infos-machine.js'));
