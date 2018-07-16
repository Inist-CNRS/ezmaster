import axios from "axios";

let ModelConfig = function() {
  let self = this;
  self.initializing = true;
  self.ajaxLoading = true;
  self.onChanges = [];
  self.d = { fullFsPercent: 100, fullMemoryPercent: 80 };

  axios
    .get("/-/v1/config")
    .then(response => {
      // data comming from AJAX request (config stuff)
      self.d = response.data;
      self.ajaxLoading = false;
      self.initializing = false;
      self.inform("config");
    })
    .catch(err => {
      console.log("ModelConfig error loading data", err);
    });
};

ModelConfig.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelConfig.prototype.inform = function(modelEvent) {
  this.onChanges.forEach(function(cb) {
    cb(modelEvent);
  });
};

export default ModelConfig;
