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

var instances = require('./lib/instances.js');
var DAV       = require('jsDAV/lib/jsdav');

// load routes and middleware
app.use(require('./middlewares/reverse-proxy.js'));
app.use(express.static('public'));
app.use('/-/v1/',          require('./routes/v1.js'));
app.use('/-/v1/config',    require('./routes/v1-config.js'));
app.use('/-/v1/app',       require('./routes/v1-app.js'));
app.use('/-/v1/hub',       require('./routes/v1-hub.js'));
app.use('/-/v1/instances', require('./routes/v1-instances.js'));

app.use(function (req, res, next) {

  if (req.url.search(/^\/dav:/) >= 0) {
    var instanceId = req.url.match('dav:([^/]+)')[1];

    instances.checkInstance(instanceId, function(err, container, data, manifest) {

      if (err) { return next(err); }

      var splittedName = data.Name.split('/');
      debug('url', req.url);
      DAV.mount({
        node: cfg.dataInstancesPath + '/' + splittedName[1] + '/data',
        mount: '/dav:' + instanceId,
        server: req.app,
        standalone: false
      }).exec(req, res);


    });

  }
  else {
    return next();
  }
  /*
  */
});




// load socket.io connections
// TODO: gérer le multi-utilisateur car la on ne communique qu'au dernier client
io.on('connection', function (socket) {
  cfg.socket = socket;
});
// start listening and forwarding docker events through websocket
require('./lib/docker-websocket.js').init(io);



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
