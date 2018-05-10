import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./App.css";
import AppToastContainer from "./AppToastContainer.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import ModalLoading from "./ModalLoading.js";
import Home from "./../tab-home/Home.js";
import Instances from "./../tab-instances/Instances.js";
import Applications from "./../tab-applications/Applications.js";

import { fetchApplicationsList } from "../models/ModelApplications.js";
import { fetchInstancesList } from "../models/ModelInstances2.js";
import { fetchConfig } from "../models/ModelConfig2.js";
import { fetchEzMasterizedApps } from "../models/ModelEzMasterizedApps.js";
import { initInfoMachinesWS } from "../models/ModelInfoMachine.js";

import Favicon from "react-favicon";
import favicon from "./favicon.png";

import bgImage from "./ezmaster-logo-bg-lighten.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingConfig: true,
      loadingInstances: true,
      loadingApplications: true,
      loadingEzMasterizedApps: true,
      config: {},
      instances: {},
      applications: [],
      ezmasterizedApps: {}
    };
  }

  componentDidMount() {
    initInfoMachinesWS();

    fetchConfig(
      function(err, config) {
        this.setState({ config, loadingConfig: false });
      }.bind(this)
    );
    fetchInstancesList(
      function(err, instances) {
        this.setState({ instances, loadingInstances: false });
      }.bind(this)
    );
    fetchApplicationsList(
      function(err, applications) {
        this.setState({ applications, loadingApplications: false });
      }.bind(this)
    );
    fetchEzMasterizedApps(
      function(err, ezmasterizedApps) {
        this.setState({ ezmasterizedApps, loadingEzMasterizedApps: false });
      }.bind(this)
    );
  }

  render() {
    return (
      <div className="App">
        {/* HTML head stuff */}
        <Favicon url={favicon} />
        <Helmet>
          <title>EzMaster</title>
        </Helmet>

        <div className="AppHeader">
          <Header
            applicationsActive={window.location.pathname === "/applications/"}
            instancesActive={window.location.pathname === "/instances/"}
          />
        </div>
        <div
          className="AppContent"
          style={{
            backgroundImage: 'url("' + bgImage + '")',
            backgroundSize: "90%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundBlendMode: "lighten"
          }}
        >
          <Switch>
            <Route
              path="/instances/"
              render={() => (
                <Instances
                  config={this.state.config}
                  instances={this.state.instances}
                  applications={this.state.applications}
                />
              )}
            />
            <Route
              path="/applications/"
              render={() => (
                <Applications
                  config={this.state.config}
                  applications={this.state.applications}
                  ezmasterizedApps={this.state.ezmasterizedApps}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  config={this.state.config}
                  instances={this.state.instances}
                  applications={this.state.applications}
                />
              )}
            />
          </Switch>
        </div>
        <div className="AppFooter">
          <Footer />
        </div>
        <ModalLoading
          modalIsOpen={true}
          loadingConfig={this.state.loadingConfig}
          loadingInstances={this.state.loadingInstances}
          loadingApplications={
            this.state.loadingApplications || this.state.loadingEzMasterizedApps
          }
        />

        <AppToastContainer />
      </div>
    );
  }
}

export default App;
