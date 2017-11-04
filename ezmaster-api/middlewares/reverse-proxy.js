'use strict';

/*
  Test the reverse proxy with curl:
  curl --proxy "" -H "X-Forwarded-Host: a-a.lod-test.istex.fr"
    -H "X-Forwarded-Server: lod-test.istex.fr" http://192.168.31.146:35269/index.html
  curl --proxy "" -H "Host: a-a.lod-test.istex.fr" http://192.168.31.146:35269/index.html
*/

var path      = require('path');
var basename  = path.basename(__filename, '.js');
var debug     = require('debug')('ezmaster:' + basename);
var instances = require('../lib/instances.js');
var cfg       = require('../lib/config.js');

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

module.exports = function (req, res, next) {

  if (req.headers['x-forwarded-for'] && !cfg.publicDomain) {
    return next(new Error('It\'s strange, EZmaster is behind a reverse proxy ' +
                          'so EZMASTER_PUBLIC_DOMAIN should be set'));
  }

  // totaly skip the revese proxy if EZMASTER_PUBLIC_DOMAIN is not set
  if (!cfg.publicDomain) {
    //debug('skiping reverse-proxy middleware');
    return next();
  }

  // check which instance is matching the http request
  instances.getInstances(function (err, instances) {

    if (err) { return new Error(err); }

    var host         = req.headers['host'];
    var reqHost      = req.headers['x-forwarded-host'];
    var reqSubdomain = reqHost ? reqHost.split('.') : false;

    // Two way to activate the RP:
    // with an explicit "Host" header
    // with the special X-Forwarded-Host headers
    // Makes the reverse proxy able to manage the HOST header.
    var isRpEnabled = {};
    isRpEnabled.byHost =
      cfg.publicDomain ?
      (host.slice(-cfg.publicDomain.length) === cfg.publicDomain) :
      false;
    isRpEnabled.byXForwarded =
      reqSubdomain && (reqHost.slice(-cfg.publicDomain.length) === cfg.publicDomain);

    // If Host header is used, we have to redefine reqSubdomain, reqHost and reqServer.
    if (isRpEnabled.byHost) {
      reqSubdomain = host.split('.');
      reqHost      = host;
    }

    // If isRpEnabled.
    if ((isRpEnabled.byXForwarded || isRpEnabled.byHost) && instances !== undefined) {

      var search = reqSubdomain[0].split('-');

      // Search the instance the user asked for.
      var technicalNameFound = Object.keys(instances)
        .filter(function (z) {
          return instances[z].running;
        })
        .map(function (z) {
          instances[z].current = instances[z].technicalName.split('-');
          instances[z].current[2] = instances[z].current[2] === undefined
            ? 0 : Number(instances[z].current[2]);
          if (Number.isNaN(Number.parseInt(instances[z].current[2]))) {
            instances[z].current[2] = 0;
          }
          return z;
        })
        .sort(function (a, b) {
          return instances[b].current[2] - instances[a].current[2];
        })
        .filter(function (x) {
          return instances[x].current[0] === search[0] && instances[x].current[1] === search[1];
        })
        .reduce(function (prev, w) {
          if (prev !== undefined) {
            return prev;
          }
          if (search[2] === undefined) {
            return w;
          }
          if (instances[w].current[0] === search[0] && instances[w].current[1] === search[1]
            && instances[w].current[2] === Number(search[2])) {
            return w;
          }
          return;
        }, undefined);

      // If the asked instance has been found.
      // We create the final URL and we go to it.
      if (technicalNameFound !== undefined) {
        var url = 'http://' + technicalNameFound + ':' + instances[technicalNameFound].httpPort;
        proxy.web(req, res, { target: url });
        proxy.on('error', function(e) {
          console.error('reverseproxy#1.1.2', e);
          next(new Error('Bad gateway'));
        });
        return;
      }
      // Else if the asked instance has not been found.
      res.status(404).send('Instance not found');
    }
    // If not isRpEnabled.
    else {
      return next();
    }

  });
};
