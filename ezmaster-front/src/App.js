import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";
import Header from "./Header.js";
import Instances from "./Instances.js";
import Applications from "./Applications.js";
import Footer from "./Footer.js";
import ModalLoading from "./ModalLoading.js";

import { fetchInstancesList } from "./ModelInstances2.js";
import { fetchConfig } from "./ModelConfig2.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingConfig: true,
      loadingInstances: true,
      config: {},
      instances: {}
    };
  }

  componentDidMount() {
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
  }

  render() {
    return (
      <div className="App">
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
            {/* by default / url is redirecting to the instances tab */}
            <Redirect to="/instances/" />
          </Switch>
        </div>
        <div className="AppFooter">
          <Footer />
        </div>
        <ModalLoading
          modalIsOpen={true}
          loadingConfig={this.state.loadingConfig}
          loadingInstances={this.state.loadingInstances}
        />

        <ToastContainer position="bottom-left" />
      </div>
    );
  }
}

export default App;
