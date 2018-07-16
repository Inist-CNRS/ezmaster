import axios from "axios";
import { subscribeToWS } from "../websocket.js";

let ModelInstances = function() {
  let self = this;
  self.initializing = true;
  self.ajaxLoading = true;
  self.onChanges = [];
  self.d = {};

  self.fetchInstancesList(function(err) {
    self.initializing = false;
    self.inform("instances");
  });

  // connect websocket to the model
  subscribeToWS("refreshInstances", data => {
    self.d = data;
    self.fillDefaultDetailField();
    self.inform("instances");
    console.log("refreshInstances XXXXX", data);
  });

  // subscribeToWS('docker-event', data => {
  //   console.log('INSTANCE MODEL', data);

  //   // filter only docker containers related to ezmaster
  //   // existing technicalName means it is an ezmaster instance
  //   if (data.Type == 'container' && data.scope == 'local' &&  data.technicalName) {

  //     // DO SOMETHING WHEN AN INSTANCE IS CREATED ?
  //     // if (data.status == 'destroy') {
  //     // }

  //     // if (data.status == 'create') {
  //     // }

  //   }
  // });
};

ModelInstances.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelInstances.prototype.inform = function(modelEvent) {
  this.onChanges.forEach(function(cb) {
    cb(modelEvent);
  });
};

ModelInstances.prototype.fetchInstancesList = function(cb) {
  let self = this;

  self.ajaxLoading = true;
  axios
    .get("/-/v1/instances")
    .then(response => {
      // data comming from AJAX request (ezmaster instances stuff)
      self.d = response.data;

      // adjust instances status, it could be: started, stopped or null (when changing its state)
      Object.keys(self.d).forEach(function(technicalName) {
        if (!self.d[technicalName].detail) {
          self.d[technicalName].detail = {
            config: "",
            size: "__ B",
            technicalName: technicalName
          };
          self.d[technicalName].technicalInstance = Math.random() > 0.5;
        }
      });

      self.ajaxLoading = false;
      self.inform("instances");
      return cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.fetchInstanceDetail = function(containerId, cb) {
  let self = this;
  const technicalName = self.getTechnicalNameFromContainerId(containerId);
  axios
    .get("/-/v1/instances/" + containerId)
    .then(response => {
      try {
        JSON.parse(response.data.config);
        self.d[technicalName].detail = {
          ...self.d[technicalName].detail,
          size: response.data.size,
          code: response.data.config,
          codeFormat: "json"
        };
      } catch (err2) {
        self.d[technicalName].detail = {
          ...self.d[technicalName].detail,
          size: response.data.size,
          code: response.data.config,
          codeFormat: "text"
        };
      }
      self.inform("instances");
      return cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.getTechnicalNameFromContainerId = function(
  containerId
) {
  let self = this;

  let technicalNameFound = "";
  Object.keys(self.d).forEach(technicalName => {
    if (self.d[technicalName].containerId == containerId) {
      technicalNameFound = technicalName;
      return;
    }
  });
  return technicalNameFound;
};
ModelInstances.prototype.getContainerIdFromTechnicalName = function(
  technicalName
) {
  let self = this;
  return self.d[technicalName].containerId;
};

ModelInstances.prototype.fillDefaultDetailField = function() {
  let self = this;

  // adjust instances status, it could be: started, stopped or null (when changing its state)
  Object.keys(self.d).forEach(function(technicalName) {
    if (!self.d[technicalName].detail) {
      self.d[technicalName].detail = {
        config: "",
        size: "__ B",
        technicalName: technicalName
      };
    }
  });
};

ModelInstances.prototype.updateInstanceConfig = function(
  containerId,
  newConfig,
  cb
) {
  let self = this;

  // PUT /-/v1/instances/config/1b129dce7d740d4a5b200301cbe73840a55b2068e6501001b31033b19b3f3733
  axios
    .put("/-/v1/instances/config/" + containerId, { newConfig })
    .then(response => {
      const technicalName = self.getTechnicalNameFromContainerId(containerId);
      self.d[technicalName].detail.config = newConfig;
      self.inform("instances");
      return cb && cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.fetchInstanceData = function(containerId) {
  let self = this;
  const technicalName = self.getTechnicalNameFromContainerId(containerId);

  axios
    .get("/-/v1/instances/" + containerId + "/data")
    .then(response => {
      console.log("OKDADADADADADA", response.data);
      self.d[technicalName].data = response.data;
      self.inform("instances");
    })
    .catch(err => {
      console.log("ModelInstances error fetchInstanceData", err);
    });
};

ModelInstances.prototype.uploadFilesToInstanceData = function(
  containerId,
  files,
  cbFile,
  cbFinish
) {
  let self = this;
  const uploadURL = "/-/v1/instances/" + containerId + "/data/";
  const technicalName = self.getTechnicalNameFromContainerId(containerId);

  // POST file uploads with axios
  const uploaders = files.map(file => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(uploadURL, formData).then(response => {
      // occurs when one file is uploaded
      console.log("DATAAAAAAAAAAAA", file, response);
      self.d[technicalName].data[file.name] = {
        key: file.name,
        modified: file.lastModified,
        size: file.size
      };
      self.inform("instances");
      cbFile && cbFile(null, file.name);
    });
  });

  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    cbFinish && cbFinish(null);
  });
};

ModelInstances.prototype.deleteFileOnInstanceData = function(
  containerId,
  fileName,
  cb
) {
  let self = this;
  const technicalName = self.getTechnicalNameFromContainerId(containerId);

  // DELETE  /-/v1/instances/625db67e2a5c4d146a505bb26c07b005cd96b4bef6c37d23ada78c4859ed2702/Dimensions%20v%C3%A9lo%20d%C3%A9cathlon%20st%C3%A9phane.pdf
  axios
    .delete("/-/v1/instances/" + containerId + "/" + fileName)
    .then(response => {
      delete self.d[technicalName].data[fileName];
      self.inform("instances");
      return cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.startInstance = function(containerId, cb) {
  let self = this;
  const technicalName = self.getTechnicalNameFromContainerId(containerId);

  self.d[technicalName].changingState = true;
  self.inform("instances");
  axios
    .put("/-/v1/instances/start/" + containerId)
    .then(response => {
      self.d[technicalName].changingState = false;
      self.d[technicalName].running = true;
      self.inform("instances");
      return cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.stopInstance = function(containerId, cb) {
  let self = this;
  const technicalName = self.getTechnicalNameFromContainerId(containerId);

  self.d[technicalName].changingState = true;
  self.inform("instances");
  axios
    .put("/-/v1/instances/stop/" + containerId)
    .then(response => {
      self.d[technicalName].changingState = false;
      self.d[technicalName].running = false;
      self.inform("instances");
      return cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.deleteInstance = function(containerId, cb) {
  let self = this;
  const technicalName = self.getTechnicalNameFromContainerId(containerId);

  // DELETE /-/v1/instances/fc9eb6873196c2733e66a69fc5d33126b2647d8b24784f3015f05b40eed3ae2d
  axios
    .delete("/-/v1/instances/" + containerId)
    .then(response => {
      // // This is dirty but do nothing here because
      // // refreshInstances Websocket event will update the list
      // delete self.d[technicalName]
      // self.inform('instances');
      return cb(null);
    })
    .catch(cb);
};

ModelInstances.prototype.createInstance = function(newInstance, cb) {
  let self = this;

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
      // // This is dirty but do nothing here because
      // // refreshInstances Websocket event will update the list
      // self.d[data.technicalName] = {
      //   ...self.d[data.technicalName],
      //   ...data
      // };
      // self.fillDefaultDetailField();
      // self.inform('instances');

      return cb(null, response.data);
    })
    .catch(cb);
};

ModelInstances.prototype.CheckInstanceAlreadyExists = function(
  technicalName,
  cb
) {
  let self = this;

  // GET /-/v1/instances/verif/<technicalName>
  axios
    .get("/-/v1/instances/verif/" + technicalName)
    .then(response => {
      return cb(null, response.data == "OK");
    })
    .catch(cb);
};

ModelInstances.prototype.refreshInstances = function(cb) {
  let self = this;
  cb = cb ? cb : () => {};

  // GET /-/v1/instances/verif/<technicalName>
  axios
    .get("/-/v1/instances/refresh")
    .then(response => {
      return cb(null, response.data);
    })
    .catch(cb);
};

export default ModelInstances;
