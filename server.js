/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/
'use strict';
var ccore = require('castor-core'),
    kuler = require('kuler')
;

module.exports = function(config, start) {
  config.set('theme', __dirname);
  config.set('timeout', 1E6);
  start(function online(err, server) {
    if (err instanceof Error) {
      console.error(kuler("Unable to init the server.", "red"), kuler(err.toString(), 'orangered'));
      process.exit(3);
      return;
    }
    var pack = config.get('package');
    if (pack) {
      console.info(kuler('App detected.', 'olive'), kuler(pack.name + ' ' + pack.version, 'limegreen'));
    }
    console.info(kuler('Server is listening.', 'olive'),  kuler(config.get('baseURL') + "/", "limegreen"));
  });
};

if (!module.parent) {
  ccore(module.exports);
}
