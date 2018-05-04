import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "./index.css";
import App from "./layout/App.js";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
