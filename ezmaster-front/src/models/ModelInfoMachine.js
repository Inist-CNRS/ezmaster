import { subscribeToWS } from "../websocket.js";

let ModelInfoMachine = function() {
  let self = this;
  self.initializing = true;
  self.onChanges = [];
  self.d = {
    nbCPUs: 1,
    loadAverage: ["...", "...", "..."],
    totalMemory: "... GB",
    freeMemory: "... MB",
    useMemoryPercentage: 0,
    diskApp: {
      freeDiskRaw: 0,
      totalDiskRaw: 0,
      freeDisk: "... GB",
      totalDisk: "... GB",
      useDiskPercentage: 0,
      fsIsAlmostFilled: false,
      maxFileCapSize: 0
    },
    diskDocker: {
      freeDiskRaw: 0,
      totalDiskRaw: 0,
      freeDisk: "... GB",
      totalDisk: "... GB",
      useDiskPercentage: 0,
      fsIsAlmostFilled: false,
      maxFileCapSize: 0
    }
  };

  // connect websocket to the model
  subscribeToWS("refreshInfosMachine", data => {
    //console.log('INFO MACHINE', data)
    self.d = data;
    self.initializing = false;
    self.inform("infoMachine");
  });
};

ModelInfoMachine.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

ModelInfoMachine.prototype.inform = function(modelEvent) {
  this.onChanges.forEach(function(cb) {
    cb(modelEvent);
  });
};

export default ModelInfoMachine;
