'use strict';

// to allow mongodb host and port injection thanks
// to the EZMASTER_MONGODB_HOST_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.EZMASTER_MONGODB_HOST_PORT || 'localhost:27017';
var publicDomain  = process.env.EZMASTER_PUBLIC_DOMAIN || '127.0.0.1';
var publicIP      = process.env.EZMASTER_PUBLIC_IP || '127.0.0.1';
var baseURL       = process.env.EZMASTER_PUBLIC_DOMAIN || 'http://' + publicIP + ':35267';

// socket variable declared here, fed in server.js and used in the 2 heartbeats events.
// The 2 heartbeats events are settled in the directory named 'heartbeats'.
var socket        = null;

module.exports = {

  connectionURI: 'mongodb://' + mongoHostPort + '/ezmaster',

  collectionName: 'data',

  publicDomain: publicDomain,

  publicIP: publicIP,

  port: 35267,

  baseURL: baseURL,

  // Export of the socket variable.
  // It is now accessible with core.config.get('socket') or config.get('socket').
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

  // THE HEARTBEATS SECTION - HEARTRATE AND EVENTS

  // The heart will beat every 1 second.
  'heartrate': 1000,

  // Heartbeats events declared here.
  // We just have to mention the file name to search instead of a complete path because
  // castor is configured to search events scripts from the project root
  // in the directory named 'heartbeats'.
  heartbeats: [
    {
      // Every 1 beat (so here every 1 seconds)
      // call a script which refreshes the machine information.
      beat : 1,
      require: 'eventRefreshInfosMachine'
    }
  ],

  middlewares: {
    // '/' means to catch all the URLs (warning do not use '/*')
    '/': 'reverseproxy.js'
  },

  filters: ['jbj-parse']

};

module.exports.package = require('./package.json');