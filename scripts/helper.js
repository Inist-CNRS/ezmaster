// IMAGE_BASENAME="library/nginx" node scripts/create-application.js

var request = require('request');


module.exports.createEzmasterApp = function (imageBaseName, imageTag, cb) {
  console.log('ezmaster app creating => ', imageBaseName + ':' + imageTag);
  request.post('http://127.0.0.1:35267/-/v1/app', { 
      timeout: 120 * 1000, // 2 minutes
      form: {
        imageName: imageBaseName,
        versionImage: imageTag,
        imageHub:"",
        username:"",
        password:"",
        email:""
      }
    }).on('end', function () {
      console.log('ezmaster app created => ', imageBaseName + ':' + imageTag);
      return cb && cb(null);
    }).on('error', function (err) {
      console.error('error', err);
      return cb && cb(err);
    });
}



module.exports.getLatestInstanceVersion = function (TECHNICAL_NAME, cb) {
  TECHNICAL_NAME = TECHNICAL_NAME.split('-');
  request.get('http://127.0.0.1:35267/-/v1/instances',
    function(err, response, instances) {
      err && console.error(err);
      instances = JSON.parse(instances);
      let versions = [];
      Object.keys(instances).forEach(function (technicalName) {
        technicalName  = technicalName.split('-');
        if (technicalName[0] == TECHNICAL_NAME[0] &&
            technicalName[1] == TECHNICAL_NAME[1]) {
          if (technicalName.length > 2) {
            versions.push(parseInt(technicalName[2], 10));
          }
        }
      });
      const maxVersion = versions.length > 0 ? Math.max(...versions) : 0;
      return cb && cb(null, maxVersion);
    });
}


module.exports.createNewInstance = function (longName, technicalName, app, cb) {
  // {"longName":"aaa","project":"istex","version":"2","study":"istexdl","technicalName":"istex-istexdl-2","app":"istex/istex-dl:4.4.0"}
  console.log('ezmaster instance creating => ', technicalName);
  request.post('http://127.0.0.1:35267/-/v1/instances', { 
      timeout: 120 * 1000, // 2 minutes
      form: {
        app: app,
        longName: longName,
        technicalName: technicalName,
        project: technicalName.split('-')[0],
        study: technicalName.split('-')[1],
        version: technicalName.split('-')[2],
      }
    }).on('end', function () {
      console.log('ezmaster instance created => ', technicalName);
      return cb && cb(null);
    }).on('error', function (err) {
      console.error('error', err);
      return cb && cb(err);
    });
}

module.exports.downloadAndCreateLatestApplicationVersion = function (IMAGE_BASENAME, cb) {
  // latest image tag
  request.get(
      'https://hub.docker.com/v2/repositories/' + IMAGE_BASENAME + '/tags/?page_size=1',
      function(err, response, IMAGE_LATEST_TAG) {
        err && console.error(err);
        IMAGE_LATEST_TAG = JSON.parse(IMAGE_LATEST_TAG);
        IMAGE_LATEST_TAG = IMAGE_LATEST_TAG.results[0].name;
        const IMAGE_NAME = IMAGE_BASENAME + ':' + IMAGE_LATEST_TAG;

        request.get(
            'http://127.0.0.1:35267/-/v1/app',
            function(err, response, apps) {
              err && console.error(err);
              apps = JSON.parse(apps);
              let found = false;
              apps.forEach(function (app) {
                const imageName = app.imageName;
                found |= (imageName == IMAGE_NAME);
              });
              if (!found) {
                // ezmaster app not found, we can create a new one
                return module.exports.createEzmasterApp(
                  IMAGE_BASENAME,
                  IMAGE_LATEST_TAG,
                  function (err) {
                    if (err) return cb && cb(err);
                    return cb && cb(null, IMAGE_NAME);
                  }
                );
              } else {
                console.log('ezmaster app already exists => ', IMAGE_NAME)
                return cb && cb(null, '');
              }
            });

      }
  );
}