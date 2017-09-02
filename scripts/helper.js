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


module.exports.getVersionComment = function (IMAGE_BASENAME, VERSION, cb) {
  request.get({
      url: 'https://api.github.com/repos/' + IMAGE_BASENAME + '/tags',
      headers: { 'User-Agent': 'node-request' } // mandatory for github
    },
    function(err, response, tags) {
      err && console.error(err);
      tags = JSON.parse(tags);
      let commitFound = false;
      tags.forEach(function (tag) {
        if (tag.name === VERSION) {
          commitFound = tag.commit.sha;
        }
      });
      if (!commitFound) return cb(null, '');
      request.get({
          url: 'https://api.github.com/repos/' + IMAGE_BASENAME + '/git/commits/' + commitFound,
          headers: { 'User-Agent': 'node-request' } // mandatory for github
        },
        function(err, response, commit) {
          err && console.error(err);
          commit = JSON.parse(commit);
          return cb && cb(null, commit.message);
        }
      );
    }
  );
}

module.exports.getInstanceFromTechnicalName = function (TECHNICAL_NAME, cb) {
  request.get('http://127.0.0.1:35267/-/v1/instances',
    function(err, response, instances) {
      if (err) return console.error(err) && cb(err);
      instances = JSON.parse(instances);
      Object.keys(instances).forEach(function (technicalName) {
        if (technicalName == TECHNICAL_NAME) {
          return cb && cb(null, instances[technicalName]);
        }
      });
    }
  );

  console.log('ezmaster app creating => ', imageBaseName + ':' + imageTag);
  request.put('http://127.0.0.1:35267/-/v1/instances/config/7bb3a44ee4e6e43a59d52dc0f9501258818341dda59a9162f861f5fe52a06d07', { 
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

module.exports.updateInstanceConfig = function (TECHNICAL_NAME, config, cb) {
  // console.log('ezmaster updating instance config => ', TECHNICAL_NAME);
  // request.put('http://127.0.0.1:35267/-/v1/instances/config/7bb3a44ee4e6e43a59d52dc0f9501258818341dda59a9162f861f5fe52a06d07', { 
  //     timeout: 120 * 1000, // 2 minutes
  //     form: {
  //       imageName: imageBaseName,
  //       versionImage: imageTag,
  //       imageHub:"",
  //       username:"",
  //       password:"",
  //       email:""
  //     }
  //   }).on('end', function () {
  //     console.log('ezmaster app created => ', imageBaseName + ':' + imageTag);
  //     return cb && cb(null);
  //   }).on('error', function (err) {
  //     console.error('error', err);
  //     return cb && cb(err);
  //   });
}


// curl 'http://127.0.0.1:35267/-/v1/instances/config/7bb3a44ee4e6e43a59d52dc0f9501258818341dda59a9162f861f5fe52a06d07' -X PUT -H 'Cookie: lang=fr; cookieconsent_status=dismiss; _ga=GA1.1.918150825.1492552970; _pk_id.37.dc78=ac574786407eee54.1493387693.19.1503657358.1503654674.; io=W71mhe01OdgKTJUKAAAB; _pk_id.42.dc78=9bdda70ecaaec121.1504352760.1.1504352760.1504352760.' -H 'Origin: http://127.0.0.1:35267' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,it;q=0.2' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://127.0.0.1:35267/' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' --data-binary '{"newConfig":{"test":2}}' --compressed
// 
// 
// 