// IMAGE_BASENAME="library/nginx" node scripts/create-application.js

var request = require('request');

const IMAGE_BASENAME = process.env.IMAGE_BASENAME ? process.env.IMAGE_BASENAME : "istex/istex-dl";

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
              createEzmasterApp(IMAGE_BASENAME, IMAGE_LATEST_TAG);
            } else {
              console.log('ezmaster app already exists => ', IMAGE_NAME)
            }
          });

    });

function createEzmasterApp(imageBaseName, imageTag, cb) {
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


