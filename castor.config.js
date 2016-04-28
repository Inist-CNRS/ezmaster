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
  browserifyModules : ['vue', 'vue-resource'],
  rootURL : '/',
  routes: [
    'route.js'
  ],
  filters: ['jbj-parse']
};
module.exports.package = require('./package.json');
