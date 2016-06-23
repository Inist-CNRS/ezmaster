/*jshint node:true, laxcomma:true */
"use strict";

var httpProxy = require('http-proxy');
var instances = require('../helpers/instances');
var util = require('utile');

module.exports = function(options, core, data) {


  var proxy = httpProxy.createProxyServer({})
    , domainEnv = core.config.get('publicDomain');


  return function(req, res, next) {




    instances.getInstances(function(err,data){
    var reqServer = req.headers['x-forwarded-server']
      , reqHost = req.headers['x-forwarded-host']
      , reqSubdomain = reqHost ? reqHost.split('.') : null
      ;



    console.log('reverseproxy#1',reqSubdomain,' && (', reqServer, ' === ', domainEnv, ")");

    console.log("");
    console.log("########## DEBUG ##########");
    console.log("DATA : " + data);
    console.log("REQHOST : " + reqHost);
    console.log("REQSUBDOMAIN : " + reqSubdomain);
    console.log("REQSERVER : " + reqServer);
    console.log("DOMAINENV : " + domainEnv);
    console.log("########## FIN DEBUG ##########");
    console.log("");


    if(reqSubdomain && (reqServer === domainEnv) && data !== undefined) {





      console.log('reverseproxy#1.1');

      var search = reqSubdomain[0].split('-');

      var found = Object.keys(data)
      .map(function(z) {
        data[z].current = data[z].id.split('-');
        data[z].current[2] = data[z].current[2] === undefined ? 0 : Number(data[z].current[2]);
        if (Number.isNaN(data[z].current[2])) {
          data[z].current[2] = 0;
        }
        return z;
      })
      .sort(function(a, b) {
        return data[a].current[2] < data[b].current[2];
      })
      .filter(function(x) {
        return data[x].current[0] === search[0] && data[x].current[1] === search[1];
      })
      .reduce(function(prev, w) {
        if (prev !== undefined) {
          return prev;
        }
        if (search[2] === undefined) {
          return w;
        }
        if (data[w].current[0] === search[0] && data[w].current[1] === search[1] && data[w].current[2] === Number(search[2])) {
          return w;
        }
        return;
      }, undefined);

      console.log("########## FOUND : " + found + " ##########");

      if (found !== undefined) {
        var url = 'http://'+publicIP+':' + data[found].port;
        console.log('reverseproxy#1.1.1', url);
        proxy.web(req, res, { target: url });
        proxy.on('error', function(e) {
          console.error("reverseproxy#1.1.2", e);
          next(new Error('Bad gateway'))
        } );
        return;
      }
      else {
        console.log('reverseproxy#1.2');
        res.render('404', { title: 'No any app found :( !', path: '/', userName: req.user });
      }
    }
    else {
      console.log('reverseproxy#1.0');
      next();
    }
    })
  }

}