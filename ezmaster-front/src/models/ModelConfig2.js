import axios from "axios";

export function fetchConfig(cb) {
  axios
    .get("/fakeapi/config.json")
    .then(response => {
      // data comming from AJAX request (config stuff)
      let data = response.data;
      return cb(null, data);
    })
    .catch(cb);
}
