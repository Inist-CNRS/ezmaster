import axios from "axios";
import { subscribeToWS } from "../websocket.js";

let ModelApplications = function() {
  let self = this;
  self.initializing = true;
  self.ajaxLoading = true;
  self.onChanges = [];
  self.d = [];
  self.refreshApplicationsList();

  // connect websocket to the model
  subscribeToWS("statusPull", data => {
    self.dockerPull = data;
    self.inform("applications");
  });
};

ModelApplications.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelApplications.prototype.inform = function(modelEvent) {
  this.onChanges.forEach(function(cb) {
    cb(modelEvent);
  });
};

ModelApplications.prototype.refreshApplicationsList = function() {
  let self = this;
  axios
    .get("/-/v1/app")
    .then(response => {
      // data comming from AJAX request (ezmaster app stuff)
      self.d = response.data.sort((a, b) => {
        return a.imageName < b.imageName ? -1 : 1;
      });
      self.ajaxLoading = false;
      self.initializing = false;
      self.inform("applications");
    })
    .catch(err => {
      console.error("ModelApplications error: refreshApplicationsList", err);
    });
};

ModelApplications.prototype.deleteApplication = function(application) {
  let self = this;
  setTimeout(function() {
    self.inform("applications");
  }, 1000);
};

ModelApplications.prototype.createApplication = function(newApplication, cb) {
  let self = this;

  // POST /-/v1/app
  // {"imageName":"istex/istex-view","versionImage":"2.5.1","imageHub":"","username":"","password":"","email":""}
  const data = {
    imageName: newApplication.imageName,
    versionImage: newApplication.versionImage,
    imageHub: newApplication.imageHub,
    username: newApplication.username,
    password: newApplication.password,
    email: newApplication.email
  };

  axios
    .post("/-/v1/app", data)
    .then(response => {
      // call the refreshApplicationsList function because
      // the response of the createApplication API call does not
      // contain the necessary data to add the data to the list
      self.refreshApplicationsList();
      return cb(null, response.data);
    })
    .catch(cb);
};

ModelApplications.prototype.searchDockerHubImageName = function(searchTxt, cb) {
  let self = this;
  cb = cb || function() {};

  if (!searchTxt) return cb(null, []);

  self.ajaxLoading = true;
  axios
    .get(
      "/-/v1/hub/search/repositories/?query=" +
        searchTxt +
        "&page=1&page_size=5"
    )
    .then(response => {
      let applicationsList = response.data.results.map(function(item) {
        return {
          name: item.repo_name,
          description: item.short_description
        };
      });
      applicationsList = applicationsList.filter(item => {
        return item.name != "inistcnrs/ezmaster";
      });
      return cb(null, applicationsList);
    })
    .catch(cb);
};

ModelApplications.prototype.searchDockerHubImageVersion = function(
  imageName,
  cb
) {
  let self = this;
  cb = cb || function() {};

  if (!imageName) return cb(null, []);

  self.ajaxLoading = true;
  axios
    .get("/-/v1/hub/repositories/" + imageName + "/tags/?page=1&page_size=5")
    .then(response => {
      let applicationsVersionList = response.data.results.sort((a, b) => {
        return a.last_updated < b.last_updated;
      });
      applicationsVersionList = applicationsVersionList.map(function(item) {
        return {
          name: item.name
        };
      });
      return cb(null, applicationsVersionList);
    })
    .catch(cb);
};

export default ModelApplications;
