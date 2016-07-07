'use strict';

// to allow mongodb host and port injection thanks
// to the EZMASTER_MONGODB_HOST_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.EZMASTER_MONGODB_HOST_PORT || 'localhost:27017';
var publicDomain  = process.env.EZMASTER_PUBLIC_DOMAIN || '127.0.0.1';
var publicIP      = process.env.EZMASTER_PUBLIC_IP || '127.0.0.1';
var baseURL       = process.env.EZMASTER_PUBLIC_DOMAIN || 'http://' + publicIP + ':35267';
var socket        = null;

module.exports = {

  connectionURI: 'mongodb://' + mongoHostPort + '/ezmaster',

  collectionName: 'data',

  publicDomain: publicDomain,

  publicIP: publicIP,

  port: 35267,

  baseURL: baseURL,

  socket: socket,

  browserifyModules : [
    'vue'
    , 'vue-resource'
    , 'components/addInstance'
    , 'components/table'
    , 'components/infosMachineTable'
    , 'vue-validator'
    , 'heartbeats'
  ],

  rootURL : '/',

  routes: [
    'config.js',
    'route.js',
    'status.js'
  ],

  // The heart will beat every 1 second.
  "heartrate": 1000,

  // Heartbeats events declared here.
  heartbeats: [
    {
      // Every 1 beat call a script describing things to do.
      beat : 1,
      require: '../../../../helpers/serverHeart.js'
    },
    {
      // Every 5 beats call a script describing things to do.
      beat : 5,
      require: '../../../../helpers/serverHeart2.js'
    }
  ],

  middlewares: {
    // '/' means to catch all the URLs (warning do not use '/*')
    '/': 'reverseproxy.js'
  },

  filters: ['jbj-parse']

};

module.exports.package = require('./package.json');
