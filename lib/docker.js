/**
 * Centralize docker low level stuff.
 * - dockerode object
 * - docker-event object
 */

'use strict';

var path       = require('path');
var basename   = path.basename(__filename, '.js');
var debug      = require('debug')('ezmaster:' + basename);

var DockerEvents = require('docker-events');
var Docker       = require('dockerode');
var exec         = require('child_process').exec;

var shared = {};
shared.docker  = new Docker({ socketPath: '/var/run/docker.sock'});
shared.emitter = new DockerEvents({ docker: shared.docker });
shared.emitter.start();

/**
 * Used to create a shared and private network for
 * all the ezmaster hosted instances
 */
shared.createEzmasterNetwork = function (cb) {
  cb = cb || function () {};
  var cmd = 'docker network create --driver bridge ezmaster_network';
  exec(cmd, function (err, stdout, stderr) {
    if (err) return cb(err, false);
    return cb(null);
  });
};

module.exports = shared;