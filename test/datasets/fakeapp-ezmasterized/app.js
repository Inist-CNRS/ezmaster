// basic http server listening on http://127.0.0.1:3333 and returning the config.json value
'use strict';

var http   = require('http');
var config = require('./config.json');
var fs     = require('fs');

var server = http.createServer(function (req, res) {
  if (req.url == '/') {
    res.end(JSON.stringify(config));
  } else if (req.url === '/env') {
    res.end(JSON.stringify(process.env));
  } else {
    fs.createReadStream('./data/hello.csv').pipe(res);
  }
});

server.listen(3333);
