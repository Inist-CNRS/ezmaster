
'use strict';

/*
  Test the reverse proxy with curl:
  curl --proxy "" -H "X-Forwarded-Host: a-a.lod-test.istex.fr"
    -H "X-Forwarded-Server: lod-test.istex.fr" http://192.168.31.146:35267/index.html
  curl --proxy "" -H "Host: a-a.lod-test.istex.fr" http://192.168.31.146:35267/index.html
*/

var path      = require('path');
var basename  = path.basename(__filename, '.js');
var debug     = require('debug')('ezmaster:' + basename);
var httpProxy = require('http-proxy');
var instances = require('../helpers/instances');


module.exports = function(options, core) {

  var proxy = httpProxy.createProxyServer({});
  var publicDomain = core.config.get('publicDomain');

  return function(req, res, next) {

    // false for instancesChangesBool because when this code is executed
    // the cache is already present in getInstances().
    instances.getInstances(false, function (err, instances) {

      if (err) { return new Error(err); }

      var host         = req.headers['host'];
      var reqServer    = req.headers['x-forwarded-server'];
      var reqHost      = req.headers['x-forwarded-host'];
      var reqSubdomain = reqHost ? reqHost.split('.') : false;

      // Two way to activate the RP:
      // with an explicit "Host" header
      // with the special X-Forwarded-* headers
      // Makes the reverse proxy able to manage the HOST header.
      var isRpEnabled = {};
      isRpEnabled.byHost =
        publicDomain ?
        (host.slice(-publicDomain.length) === publicDomain) :
        false;
      isRpEnabled.byXForwarded = reqSubdomain && (reqServer === publicDomain);

      // If Host header is used, we have to redefine reqSubdomain, reqHost and reqServer.
      if (isRpEnabled.byHost) {

        reqSubdomain = host.split('.');
        reqHost = host;
        reqServer = host.split('.')[1] + '.' + host.split('.')[2] + '.' + host.split('.')[3];

      }

      // If isRpEnabled.
      if ((isRpEnabled.byXForwarded || isRpEnabled.byHost) && instances !== undefined) {

        var search = reqSubdomain[0].split('-');

        // Search the instance the user asked for.
        var found = Object.keys(instances)
          .map(function(z) {
            instances[z].current = instances[z].technicalName.split('-');
            instances[z].current[2] = instances[z].current[2] === undefined
              ? 0 : Number(instances[z].current[2]);
            if (Number.isNaN(instances[z].current[2])) {
              instances[z].current[2] = 0;
            }
            return z;
          })
          .sort(function (a, b) {
            return instances[a].current[2] < instances[b].current[2];
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

        // We feed the variable used to create the final URL.
        // This variable takes a different value if the Host header is used.
        var finalUrlLeftPart = found;
        if (isRpEnabled.byHost) {
          finalUrlLeftPart = host.split('.')[0];
        }

        // If the asked instance has been found.
        // We create the final URL and we go to it.
        if (found !== undefined) {
          var url = 'http://'+finalUrlLeftPart+':'+ '3000';
          proxy.web(req, res, { target: url });
          proxy.on('error', function(e) {
            console.error('reverseproxy#1.1.2', e);
            next(new Error('Bad gateway'));
          });
          return;
        }
        // Else if the asked instance has not been found.
        res.render('404', { title: 'No any app found :( !', path: '/', userName: req.user });
      }
      // If not isRpEnabled.
      else {
        return next();
      }

    });
  };
};