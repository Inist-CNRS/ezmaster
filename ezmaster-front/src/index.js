import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "./index.css";
import App from "./App";

import ModelConfig from "./ModelConfig.js";

let modelConfig = new ModelConfig();
modelConfig.subscribe(render);

function render() {
  ReactDOM.render(
    <Router>
      <App config={modelConfig.data} />
    </Router>,
    document.getElementById("root")
  );
}
render();
