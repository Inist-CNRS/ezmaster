import axios from "axios";

export function fetchInstancesList(cb) {
  axios
    .get("/fakeapi/instances.json")
    .then(response => {
      // data comming from AJAX request (ezmaster instances stuff)
      let data = response.data;

      // adjust instances status, it could be: started, stopped or null (when changing its state)
      Object.keys(data).forEach(function(technicalName) {
        data[technicalName].status = data[technicalName].running
          ? "started"
          : "stopped";
      });

      return cb(null, data);
    })
    .catch(cb);
}

export function fetchInstanceDetail(containerId, cb) {
  axios
    .get("/fakeapi/" + containerId + ".json")
    .then(response => {
      return cb(null, response.data);
    })
    .catch(cb);
}

export function deleteInstance(containerId, cb) {
  setTimeout(function() {
    return cb(null);
  }, 1000);
}

export function updateInstanceConfig(containerId, newConfig, cb) {
  setTimeout(function() {
    console.log("updateInstanceConfig", containerId, newConfig);
    return cb(null);
  }, 1000);
}

export function createInstance(newInstance, cb) {
  setTimeout(function() {
    console.log("createInstance", newInstance);
    return cb(null, newInstance);
  }, 1000);
}
