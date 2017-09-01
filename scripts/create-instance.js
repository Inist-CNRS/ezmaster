// IMAGE_BASENAME="library/nginx" node scripts/create-application.js
// GET http://127.0.0.1:35267/-/v1/instances/verif/istex-istexdl-2
// curl 'http://127.0.0.1:35267/-/v1/instances' -H 'Cookie: lang=fr; cookieconsent_status=dismiss; _ga=GA1.1.918150825.1492552970; _pk_id.37.dc78=ac574786407eee54.1493387693.19.1503657358.1503654674.; io=Eb_hSXVfR2CgWzkRAAAA' -H 'Origin: http://127.0.0.1:35267' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,it;q=0.2' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://127.0.0.1:35267/' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' --data-binary '{"longName":"aaa","project":"istex","version":"2","study":"istexdl","technicalName":"istex-istexdl-2","app":"istex/istex-dl:4.4.0"}' --compressed
// 
var helper = require('./helper.js');

const TECHNICAL_NAME = process.env.TECHNICAL_NAME ? process.env.TECHNICAL_NAME : "istex-istexdl";




helper.getLatestInstanceVersion('istex-istexdl', console.log);
helper.createNewInstance('Bla bla', 'istex-istexdl-6', 'istex/istex-dl:4.4.0', console.log);