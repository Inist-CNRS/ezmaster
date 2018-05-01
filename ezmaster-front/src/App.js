import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import {Helmet} from "react-helmet";

import "./App.css";
import AppToastContainer from "./AppToastContainer.js";
import Header from "./Header.js";
import Home from "./Home.js";
import Instances from "./Instances.js";
import Applications from "./Applications.js";
import Footer from "./Footer.js";
import ModalLoading from "./ModalLoading.js";

import { fetchApplicationsList } from "./ModelApplications.js";
import { fetchInstancesList } from "./ModelInstances2.js";
import { fetchConfig } from "./ModelConfig2.js";
import { initInfoMachinesWS } from "./ModelInfoMachine.js";

import Favicon from 'react-favicon';
import favicon from "./favicon.png";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingConfig: true,
      loadingInstances: true,
      loadingApplications: true,
      config: {},
      instances: {},
      applications: []
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
        <div className="AppContent">
          <Switch>
            <Route
              path="/instances/"
              component={() => (
                <Instances
                  config={this.state.config}
                  instances={this.state.instances}
                />
              )}
            />
            <Route
              path="/applications/"
              component={() => <Applications config={this.state.config} />}
            />
            <Route
              path="/"
              component={() => (
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
          loadingApplications={this.state.loadingApplications}
        />

        <AppToastContainer />
      </div>
    );
  }
}

export default App;
