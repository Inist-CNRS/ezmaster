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

import Favicon from "react-favicon";
import favicon from "./favicon.png";

import bgImage from "./ezmaster-logo-bg-lighten.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
            modelEvent={this.props.modelEvent}
            config={this.props.config}
            infoMachine={this.props.infoMachine}
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
                  modelEvent={this.props.modelEvent}
                  config={this.props.config}
                  instances={this.props.instances}
                  applications={this.props.applications}
                />
              )}
            />
            <Route
              path="/applications/"
              render={() => (
                <Applications
                  modelEvent={this.props.modelEvent}
                  config={this.props.config}
                  applications={this.props.applications}
                  usedApplications={Object.keys(this.props.instances.d).map(i => this.props.instances.d[i].app)}
                  ezMasterizedApps={this.props.ezMasterizedApps}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  modelEvent={this.props.modelEvent}
                  config={this.props.config}
                  infoMachine={this.props.infoMachine}
                  instances={this.props.instances}
                  applications={this.props.applications}
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
          loadingConfig={this.props.config.initializing}
          loadingInfoMachine={this.props.infoMachine.initializing}
          loadingInstances={this.props.instances.initializing}
          loadingApplications={
            this.props.applications.initializing ||
            this.props.ezMasterizedApps.initializing
          }
        />

        <AppToastContainer />
      </div>
    );
  }
}

export default App;
