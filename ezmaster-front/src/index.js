import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "./index.css";
import App from "./layout/App.js";

import ModelConfig from "./models/ModelConfig2.js";
import ModelInfoMachine from "./models/ModelInfoMachine.js";
import ModelApplications from "./models/ModelApplications.js";
import ModelInstances from "./models/ModelInstances2.js";
import ModelEzMasterizedApps from "./models/ModelEzMasterizedApps.js";

let modelConfig = new ModelConfig();
let modelInfoMachine = new ModelInfoMachine();
let modelApplications = new ModelApplications();
let modelInstances = new ModelInstances();
let modelEzMasterizedApps = new ModelEzMasterizedApps();
modelConfig.subscribe(render);
modelInfoMachine.subscribe(render);
modelApplications.subscribe(render);
modelInstances.subscribe(render);
modelEzMasterizedApps.subscribe(render);

function render(modelEvent) {
  ReactDOM.render(
    <Router>
      <App
        modelEvent={modelEvent}
        config={modelConfig}
        infoMachine={modelInfoMachine}
        applications={modelApplications}
        instances={modelInstances}
        ezMasterizedApps={modelEzMasterizedApps}
      />
    </Router>,
    document.getElementById("root")
  );
}
