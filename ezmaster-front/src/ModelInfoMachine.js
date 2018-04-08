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

      // {
      //     "loadAverage": ["0.14", "0.38", "0.64"],
      //     "totalMemory": "1.95 GB",
      //     "freeMemory": "95.1 MB",
      //     "useMemoryPercentage": "95",
      //     "nbCPUs": 2,
      //     "fsIsAlmostFilled": false,
      //     "diskApp":
      //     {
      //         "freeDiskRaw": 3373182976,
      //         "totalDiskRaw": 10434699264,
      //         "freeDisk": "3.14 GB",
      //         "totalDisk": "9.72 GB",
      //         "useDiskPercentage": 68,
      //         "fsIsAlmostFilled": false,
      //         "maxFileCapSize": 775549747
      //     },
      //     "diskDocker":
      //     {
      //         "freeDiskRaw": 15061671936,
      //         "totalDiskRaw": 31639728128,
      //         "freeDisk": "14.03 GB",
      //         "totalDisk": "29.47 GB",
      //         "useDiskPercentage": 52,
      //         "fsIsAlmostFilled": false,
      //         "maxFileCapSize": 7396279910
      //     }
      // }

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
