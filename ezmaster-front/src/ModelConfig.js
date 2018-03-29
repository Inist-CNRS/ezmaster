import axios from "axios";

let ModelConfig = function(options) {
  const self = this;
  self.onChanges = [];
  self.data = {};

  self.initializing = true;
  self.ajaxLoading = true;

  setTimeout(function() {
    axios
      .get("/fakeapi/config.json")
      .then(response => {
        // data comming from AJAX request (config stuff)
        self.data = response.data;

        self.initializing = false;
        self.ajaxLoading = false;
        self.inform();
      })
      .catch(err => {
        console.log("ModelConfig error", err);
        self.ajaxLoading = false;
        self.inform();
      });
  }, 1000);
};

ModelConfig.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelConfig.prototype.inform = function() {
  this.onChanges.forEach(function(cb) {
    cb();
  });
};

export default ModelConfig;
