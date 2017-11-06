/**
 * This file must be required to access ezmaster
 * configuration parameters.
 * The parameters are loaded from config.json then can be overloaded
 * from shell environnement (or other way rc can handle).
 */
'use strict';

var _    = require('lodash');
var path = require('path');

// extract default configuration from package.json
// then uses rc to make possible overloading with env var
var configDefault = _.mapKeys(require('../config.json'), function (v, k) {
  return k.replace('EZMASTER_', '');
});
var cfg = require('rc')('EZMASTER', configDefault);
cfg = _.mapKeys(cfg, function (v, k) {
  return (k == '_' ? k : 'EZMASTER_' + k);
});

// precalculate other internal config parameters
cfg.fullFsPercent = parseFloat(cfg.EZMASTER_FULL_FS_PERCENT) || 80;
cfg.freePortRange = cfg.EZMASTER_FREE_PORT_RANGE || '49152-60000';
cfg.publicIP      = cfg.EZMASTER_PUBLIC_IP || '127.0.0.1';
cfg.port          = cfg.EZMASTER_PORT || 35269;
cfg.publicDomain  = cfg.EZMASTER_PUBLIC_DOMAIN || '';


// ezmaster_db will be deprecated (removed) in ezmaster v5
cfg.mongoHostPort = cfg.EZMASTER_MONGODB_HOST_PORT;
cfg.connectionURI = 'mongodb://' + cfg.mongoHostPort + '/ezmaster';

cfg.dataInstancesPath    = path.join(__dirname, '/../data/instances');
cfg.dataManifestsPath    = path.join(__dirname, '/../data/manifests');
cfg.dataApplicationsPath = path.join(__dirname, '/../data/applications');

// public parameters we want to communicate to the browser
// (ie. accessible by the /-/v1/config route)
cfg.publicParameters = [
  'fullFsPercent', 'publicIP', 'port', 'publicDomain'
];

module.exports = cfg;
module.exports.package = require('../package.json');