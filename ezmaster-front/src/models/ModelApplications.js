import axios from "axios";

export function fetchApplicationsList(cb) {
  axios
    .get("/-/v1/app")
    .then(response => {
      // data comming from AJAX request (ezmaster app stuff)
      let data = response.data;

      return cb(null, data);
    })
    .catch(cb);
}

export function deleteApplication(application, cb) {
  setTimeout(function() {
    return cb(null);
  }, 1000);
}

export function createApplication(newApplication, cb) {
  setTimeout(function() {
    console.log("createApplication", newApplication);
    return cb(null, newApplication);
  }, 1000);
}
