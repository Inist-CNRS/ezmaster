// basic http server listening on http://127.0.0.1:3333 and returning the config.json value

var http   = require('http');
var config = require('./config.json');

var server = http.createServer(function (req, res) {
  res.end(JSON.stringify(config));
});

server.listen(3333);