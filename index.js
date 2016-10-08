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

app.use(express.static('public'));
app.use('/', require('./routes/v1.js'));

io.on('connection', function (socket) {
  cfg.socket = socket;
});

server.listen(cfg.EZMASTER_PORT, function (err) {
  console.info(kuler(cfg.package.name + ' ' + cfg.package.version + ' is listening.', 'olive'));
  console.info(kuler(cfg.baseURL + '/', 'limegreen'));
});
