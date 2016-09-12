'use strict';

// to allow mongodb host and port injection thanks
// to the EZMASTER_MONGODB_HOST_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.EZMASTER_MONGODB_HOST_PORT || 'localhost:27017';
var publicDomain  = process.env.EZMASTER_PUBLIC_DOMAIN || '';
var publicIP      = process.env.EZMASTER_PUBLIC_IP || '127.0.0.1';
var baseURL       = process.env.EZMASTER_PUBLIC_DOMAIN || 'http://' + publicIP + ':35267';
var fullFsPercent = process.env.EZMASTER_FULL_FS_PERCENT || 80;
var freePortRange = process.env.EZMASTER_FREE_PORT_RANGE || '49152-60000';

module.exports = {

  connectionURI: 'mongodb://' + mongoHostPort + '/ezmaster',

  collectionName: 'data',

  publicDomain: publicDomain,

  fullFsPercent: fullFsPercent,

  freePortRange: freePortRange,

  publicIP: publicIP,

  port: 35267,

  baseURL: baseURL,

  browserifyModules : [
    'vue'
    , 'vue-resource'
    , 'vue-validator'
    , 'heartbeats'
    , 'components/entryPoint'
  ],

  browserifyTransformers: [
    'vueify'
  ],

  rootURL : '/',

  routes: [
    'config.js',
    'v1.js',
    'status.js'
  ],

  // THE HEARTBEATS SECTION - HEARTRATE AND EVENTS

  // The heart will beat every 1 second.
  'heartrate': 1000,

  // Heartbeats events declared here.
  // The heartbeats events are settled in the directory named 'heartbeats'.
  // We just have to mention the file name to search instead of a complete path because
  // castor is configured to search events scripts from the project root
  // in the directory named 'heartbeats'.
  heartbeats: [
    {
      // Every 1 beat (so here every 1 seconds)
      // call a script which refreshes the machine information.
      beat : 1,
      require: 'eventRefreshInfosMachine'
    },
    {
      // Every 5 beats (so here every 5 seconds)
      // call a script which refreshes the instances list.
      beat : 1,
      require: 'eventRefreshInstances'
    }
  ],

  middlewares: {
    // '/' means to catch all the URLs (warning do not use '/*')
    '/': 'reverseproxy.js'
  },

  filters: ['jbj-parse']

};

module.exports.package = require('./package.json');
