import axios from "axios";
import { parseEzMasterizedAppsMD } from "../helpers.js";

let ModelEzMasterizedApps = function() {
  let self = this;
  self.initializing = true;
  self.ajaxLoading = true;
  self.onChanges = [];
  self.d = [];

  const url =
    "https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/EZMASTERIZED.md";
  axios
    .get(url)
    .then(response => {
      // response.data comming from AJAX request (raw markdown)
      self.d = parseEzMasterizedAppsMD(response.data);
      self.ajaxLoading = false;
      self.initializing = false;
      self.inform("ezMasterizedApps");
    })
    .catch(err => {
      console.log("ModelEzMasterizedApps error loading data", err);
    });
};

ModelEzMasterizedApps.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelEzMasterizedApps.prototype.inform = function(modelEvent) {
  this.onChanges.forEach(function(cb) {
    cb(modelEvent);
  });
};

export default ModelEzMasterizedApps;
