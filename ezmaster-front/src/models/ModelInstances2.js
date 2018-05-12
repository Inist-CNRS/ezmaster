import axios from "axios";

export function createInstance(newInstance, cb) {
  // POST /-/v1/instances
  // { app : "inistcnrs/ezmaster-phpserver:1.0.2"
  // longName : "Long nammmme"
  // project : "teee"
  // study : "tiii"
  // technicalName : "teee-tiii"
  // version : "" }
  const tnSplitted = newInstance.technicalName.split("-");
  const data = {
    app: newInstance.application,
    longName: newInstance.longName,
    technicalName: newInstance.technicalName,
    project: tnSplitted[0],
    study: tnSplitted[1],
    version: tnSplitted[2] ? tnSplitted[2] : ""
  };

  axios
    .post("/-/v1/instances", data)
    .then(response => {
      return cb(null, response.data);
    })
    .catch(cb);
}

export function deleteInstance(containerId, cb) {
  // DELETE /-/v1/instances/fc9eb6873196c2733e66a69fc5d33126b2647d8b24784f3015f05b40eed3ae2d
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

export function startInstance(containerId, cb) {
  callSubscribedInstanceStatusCallbacks(containerId, true, true);

  axios
    .put("/-/v1/instances/start/" + containerId)
    .then(response => {
      callSubscribedInstanceStatusCallbacks(containerId, true, false);
      return cb(null, response.data);
    })
    .catch(cb);
}
export function stopInstance(containerId, cb) {
  callSubscribedInstanceStatusCallbacks(containerId, false, true);

  axios
    .put("/-/v1/instances/stop/" + containerId)
    .then(response => {
      callSubscribedInstanceStatusCallbacks(containerId, false, false);
      return cb(null, response.data);
    })
    .catch(cb);
}

/**
 * System used to notify when an instance is started or stopped
 * this is used because several component need to know when one
 * instance status is changing (BtnStartStop and BadgeStatus).
 */
let statusSubscribers = {};
export function subscribeToInstanceStatus(containerId, tag, cbToCall) {
  statusSubscribers[containerId] = statusSubscribers[containerId]
    ? statusSubscribers[containerId]
    : {};
  statusSubscribers[containerId][tag] = cbToCall;
}
export function unsubscribeToInstanceStatus(containerId, tag) {
  delete statusSubscribers[containerId][tag];
}
function callSubscribedInstanceStatusCallbacks(
  containerId,
  status,
  intermediate
) {
  if (statusSubscribers[containerId]) {
    Object.keys(statusSubscribers[containerId]).forEach(tag => {
      return statusSubscribers[containerId][tag](null, status, intermediate);
    });
  }
}
