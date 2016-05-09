'use strict';
// to allow mongodb host and port injection thanks
// to the MONGODB_URI environment parameter
// (docker uses it)
var mongoHostPort = process.env.MONGODB_URI ?
                    process.env.MONGODB_URI :
                    'localhost:27017';

module.exports = {
  connectionURI: 'mongodb://' + mongoHostPort + '/ezmaster',
  collectionName: 'data',
  browserifyModules : ['vue', 'vue-resource', 'components/addInstance', 'components/table'],
  rootURL : '/',
  routes: [
    'route.js'
  ],
  filters: ['jbj-parse']
};
module.exports.package = require('./package.json');
