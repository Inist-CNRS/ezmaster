// IMAGE_BASENAME="library/nginx" node scripts/create-application.js
// GET http://127.0.0.1:35267/-/v1/instances/verif/istex-istexdl-2
// curl 'http://127.0.0.1:35267/-/v1/instances' -H 'Cookie: lang=fr; cookieconsent_status=dismiss; _ga=GA1.1.918150825.1492552970; _pk_id.37.dc78=ac574786407eee54.1493387693.19.1503657358.1503654674.; io=Eb_hSXVfR2CgWzkRAAAA' -H 'Origin: http://127.0.0.1:35267' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,it;q=0.2' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://127.0.0.1:35267/' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' --data-binary '{"longName":"aaa","project":"istex","version":"2","study":"istexdl","technicalName":"istex-istexdl-2","app":"istex/istex-dl:4.4.0"}' --compressed
// 
var request = require('request');

const TECHNICAL_NAME = process.env.TECHNICAL_NAME ? process.env.TECHNICAL_NAME : "istex-istexdl";

function getLatestInstanceVersion(TECHNICAL_NAME, cb) {
  request.get('http://127.0.0.1:35267/-/v1/instances',
    function(err, response, instances) {
      err && console.error(err);
      instances = JSON.parse(instances);
      let versions = [];
      Object.keys(instances).forEach(function (technicalName) {
        technicalName  = technicalName.split('-');
        TECHNICAL_NAME = TECHNICAL_NAME.split('-');
        if (technicalName[0] == TECHNICAL_NAME[0] &&
            technicalName[1] == TECHNICAL_NAME[1]) {
          if (technicalName.length > 2) {
            versions.push(parseInt(technicalName[2], 10));
          }
        }
      });
      return cb && cb(Math.max(versions));
    });
}


function createNewInstance(longName, technicalName, app, cb) {
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



getLatestInstanceVersion('istex-istexdl', console.log);
createNewInstance('Bla bla', 'istex-istexdl-3', 'istex/istex-dl:4.4.0', console.log);