import axios from "axios";

export function fetchInfoMachines(cb) {
  axios
    .get("/fakeapi/info-machines.json")
    .then(response => {
      // data comming from AJAX request (info-machines stuff)
      let data = response.data;

      data.loadaverage = [
        (Math.random() * data.nbCPUs * 2).toFixed(1),
        (Math.random() * data.nbCPUs * 2).toFixed(1),
        (Math.random() * data.nbCPUs * 2).toFixed(1)
      ];

      return cb(null, data);
    })
    .catch(cb);
}

export function initInfoMachinesWS() {
  setInterval(function() {
    fetchInfoMachines(function(err, info) {
      subscribers.forEach(function(cbToCall) {
        return cbToCall(err, info);
      });
    });
  }, 5000);
}

let subscribers = [];
export function subscribeToInfoMachines(cbToCall) {
  subscribers.push(cbToCall);
}
