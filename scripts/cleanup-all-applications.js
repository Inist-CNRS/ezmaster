var request = require('request');
request.get('http://127.0.0.1:35267/-/v1/app', function (error, response, apps) {
  apps = JSON.parse(apps);
  apps.forEach(function (app) {
    const imageId = app.imageId;
    const imageName = app.imageName;
    if (!imageId || !imageName) return;
    const url = 'http://127.0.0.1:35267/-/v1/app/' + new Buffer(imageName).toString('base64');
    console.log('DELETE', url);
    request.delete(url, function (error, response, deleteDone) {
      console.log('app deleted: ' + app, response.statusMessage, deleteDone)
    });
  });
});