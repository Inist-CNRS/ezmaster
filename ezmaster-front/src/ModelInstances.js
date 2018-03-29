import axios from "axios";

let ModelInstances = function(options) {
  const self = this;
  self.onChanges = [];
  self.data = {};

  self.initializing = true;
  self.ajaxLoading = true;

  setTimeout(function() {
    axios
      .get("/fakeapi/instances.json")
      .then(response => {
        // data comming from AJAX request (ezmaster instances stuff)
        self.data = response.data;

        // adjust instances status, it could be: started, stopped or null (when changing its state)
        Object.keys(self.data).forEach(function(technicalName) {
          self.data[technicalName].status = self.data[technicalName].running
            ? "started"
            : "stopped";
        });

        self.initializing = false;
        self.ajaxLoading = false;
        self.inform();
      })
      .catch(err => {
        console.log("ModelInstances error", err);
        self.ajaxLoading = false;
        self.inform();
      });
  }, Math.random() * 3000);
};

ModelInstances.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelInstances.prototype.inform = function() {
  this.onChanges.forEach(function(cb) {
    cb();
  });
};

export default ModelInstances;
