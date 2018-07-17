/**
 * Centralize docker low level stuff.
 * - dockerode object
 * - docker-event object
 */

"use strict";

var path = require("path");
var basename = path.basename(__filename, ".js");
var debug = require("debug")("ezmaster:" + basename);

var DockerEvents = require("docker-events");
var Docker = require("dockerode");

var shared = {};
shared.docker = new Docker({ socketPath: "/var/run/docker.sock" });
shared.emitter = new DockerEvents({ docker: shared.docker });
shared.emitter.start();

module.exports = shared;
