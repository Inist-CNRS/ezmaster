'use strict';
// to allow mongodb host and port injection thanks
// to the MONGODB_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.MONGODB_PORT ?
                    process.env.MONGODB_PORT.replace('tcp://', '') :
                    'localhost:27017';

module.exports = {
  connectionURI: 'mongodb://' + mongoHostPort + '/ezmaster',
  collectionName: 'data',
  browserifyModules : [ 'jquery', 'mongodb-querystring' ],
  rootURL : '/',
  routes: [
    'fake-route.js'
  ],
  heartbeats: [
    {
      beat : 30,
      require: 'fake-heartbeat.js'
    }
  ],
  loaders: [
    {
      pattern : '**/*.csv',
      require : 'castor-load-csv'
    },
    {
      script: 'fake-loader.js',
      pattern: '**/*.csv'
    }
  ]
};
module.exports.package = require('./package.json');
