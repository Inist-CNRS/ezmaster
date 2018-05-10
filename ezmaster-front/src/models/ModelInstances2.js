import axios from "axios";

export function createInstance(newInstance, cb) {
  setTimeout(function() {
    console.log("createInstance", newInstance);
    return cb(null, newInstance);
  }, 1000);
}

export function deleteInstance(containerId, cb) {
  setTimeout(function() {
    return cb(null);
  }, 1000);
}

export function fetchInstancesList(cb) {
  axios
    .get("/-/v1/instances")
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
    .get("/-/v1/instances/" + containerId)
    .then(response => {
      return cb(null, response.data);
    })
    .catch(cb);
}

export function updateInstanceConfig(containerId, newConfig, cb) {
  setTimeout(function() {
    console.log("updateInstanceConfig", containerId, newConfig);
    return cb(null);
  }, 1000);
}

export function fetchInstanceData(containerId, cb) {
  axios
    .get("/-/v1/instances/" + containerId + "/data")
    .then(response => {
      return cb(null, response.data);
    })
    .catch(cb);
}

export function uploadFilesToInstanceData(containerId, files, cb) {
  const uploadURL = "/-/v1/instances/" + containerId + "/data/";

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

export function startInstance(technicalName, cb) {
  callSubscribedInstanceStatusCallbacks(technicalName, true, true);
  setTimeout(() => {
    callSubscribedInstanceStatusCallbacks(technicalName, true, false);
    return cb(null, true);
  }, 1000);
}
export function stopInstance(technicalName, cb) {
  callSubscribedInstanceStatusCallbacks(technicalName, false, true);
  setTimeout(() => {
    callSubscribedInstanceStatusCallbacks(technicalName, false, false);
    return cb(null, false);
  }, 1000);
}

/**
 * System used to notify when an instance is started or stopped
 * this is used because several component need to know when one
 * instance status is changing (BtnStartStop and BadgeStatus).
 */
let statusSubscribers = {};
export function subscribeToInstanceStatus(technicalName, tag, cbToCall) {
  statusSubscribers[technicalName] = statusSubscribers[technicalName]
    ? statusSubscribers[technicalName]
    : {};
  statusSubscribers[technicalName][tag] = cbToCall;
}
export function unsubscribeToInstanceStatus(technicalName, tag) {
  delete statusSubscribers[technicalName][tag];
}
function callSubscribedInstanceStatusCallbacks(
  technicalName,
  status,
  intermediate
) {
  if (statusSubscribers[technicalName]) {
    Object.keys(statusSubscribers[technicalName]).forEach(tag => {
      return statusSubscribers[technicalName][tag](null, status, intermediate);
    });
  }
}
