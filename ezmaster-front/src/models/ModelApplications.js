import axios from "axios";

let ModelApplications = function() {
  let self = this;
  self.initializing = true;
  self.ajaxLoading = true;
  self.onChanges = [];
  self.d = [];

  axios
    .get("/-/v1/app")
    .then(response => {
      // data comming from AJAX request (ezmaster app stuff)
      self.d = response.data;
      self.ajaxLoading = false;
      self.initializing = false;
      self.inform("applications");
    })
    .catch(err => {
      console.log("ModelApplications error loading data", err);
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

ModelApplications.prototype.deleteApplication = function(application) {
  let self = this;
  setTimeout(function() {
    self.inform("applications");
  }, 1000);
};

ModelApplications.prototype.createApplication = function(newApplication) {
  let self = this;
  setTimeout(function() {
    console.log("createApplication", newApplication);
    self.inform("applications");
  }, 1000);
};

export default ModelApplications;
