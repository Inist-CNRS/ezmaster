/* global describe, it*/
'use strict';

// Travis run this file while building.
var execSync = require('child_process').execSync
  , assert = require('chai').assert
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'});


describe('Run fakeapp', function (cb) {

  var dockerInstances = [];

  var cmd = 'docker run -d -p 60000:3000 ' +
            '-e http_proxy -e https_proxy -e EZMASTER_MONGODB_HOST_PORT '+
            '--net=ezmaster_default --link ezmaster_db '+
            '-v '+process.env.EZMASTER_PATH+'/test'
            +'/datasets/fakeapp/:/opt/ezmaster/data/ '+
            '--name fakeapp fakeapp';

  execSync(cmd);


  docker.listContainers({ all : true }, function (err, containers) {

    if (err) { return cb(err); }

    containers.forEach(function (data) {
      dockerInstances.push(data.Names[0].split('/')[1]);
    });

  });

  it('Found fakeapp', function (done) {


    var found = false;


    dockerInstances.forEach(function (instance) {

      if (instance.toString() == 'fakeapp') {
        found = true;
      }
    });
    done(assert.equal(found, true));

    var cmd = 'docker rm -f fakeapp';

    execSync(cmd);
  });
});