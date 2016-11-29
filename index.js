/**
 * EzMaster entrypoint
 */

/*eslint global-require:"warn"*/
'use strict';

var cfg   = require('./lib/config.js');
var kuler = require('kuler');

var express = require('express');
var app    = express();
var server = require('http').Server(app);
var io     = require('socket.io')(server);

// load routes and middleware
app.use(require('./middlewares/reverse-proxy.js'));
app.use(express.static('public'));
app.use('/-/v1/',          require('./routes/v1.js'));
app.use('/-/v1/config',    require('./routes/v1-config.js'));
app.use('/-/v1/app',       require('./routes/v1-app.js'));
app.use('/-/v1/hub',       require('./routes/v1-hub.js'));
app.use('/-/v1/instances', require('./routes/v1-instances.js'));

// load socket.io connections
// TODO: gérer le multi-utilisateur car la on ne communique qu'au dernier client
io.on('connection', function (socket) {
  cfg.socket = socket;
});

server.listen(cfg.EZMASTER_PORT, function () {
  console.info(kuler(cfg.package.name + ' ' + cfg.package.version + ' is listening.', 'olive'));
  console.info('EzMaster backoffice:    ' +
               kuler('http://' + cfg.publicIP + ':35267' + '/', 'limegreen'));
  if (cfg.publicDomain) {
    console.info('EzMaster reverse proxy: ' +
                 kuler('http://*.' + cfg.publicDomain + '/', 'limegreen'));
  }
});

// periodical background task
var heartbeats = require('heartbeats');
var heart = heartbeats.createHeart(1000);
heart.createEvent(5, require('./lib/event-refresh-infos-machine.js'));
heart.createEvent(2, require('./lib/event-refresh-instances.js'));
