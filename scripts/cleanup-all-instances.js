var request = require('request');
request.get('http://127.0.0.1:35267/-/v1/instances', function (error, response, instances) {
  instances = JSON.parse(instances);
  Object.keys(instances).forEach(function (instance) {
    const containerId = instances[instance].containerId;
    if (!containerId) return;
    request.delete('http://127.0.0.1:35267/-/v1/instances/' + containerId, function (error, response, deleteDone) {
      console.log('instance deleted: ' + instance, deleteDone)
    });
  });
});