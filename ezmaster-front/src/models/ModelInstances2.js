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
    .get("/fakeapi/instances/" + containerId + ".json")
    .then(response => {
      return cb(null, response.data);
    })
    .catch(cb);
}

export function fetchInstanceData(containerId, cb) {
  axios
    .get("/fakeapi/instances/" + containerId + "/data.json")
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

export function uploadFilesToInstanceData(containerId, files, cb) {
  // const uploadURL = "http://127.0.0.1:35269/-/v1/instances/" + containerId + "/data/";
  const uploadURL =
    "http://127.0.0.1:35269/-/v1/instances/04f9ee5b2733fe4fbd22d695e846530619fe27a8121a375fb144b684409c208a/data/";

  // POST file uploads with axios
  const uploaders = files.map(file => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(uploadURL, formData).then(response => {
      // occurs when one file is uploaded
    });
  });
  // Once all the files are uploaded
  axios.all(uploaders).then(cb);
}
