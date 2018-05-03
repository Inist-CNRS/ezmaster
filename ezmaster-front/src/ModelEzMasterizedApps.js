import axios from "axios";
import { parseEzMasterizedAppsMD } from "./helpers.js";

export function fetchEzMasterizedApps(cb) {
  axios
    .get("https://raw.githubusercontent.com/Inist-CNRS/ezmaster/reactjs/EZMASTERIZED.md")
    .then(response => {
      // response.data comming from AJAX request (raw markdown)
      let data = parseEzMasterizedAppsMD(response.data);
      return cb(null, data);
    })
    .catch(cb);
}
