import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.css";
import Header from "./Header.js";
import Instances from "./Instances.js";
import Footer from "./Footer.js";
import ModalLoading from "./ModalLoading.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="AppHeader">
          <Header />
        </div>
        <div className="AppContent">
          {/* by default / url is redirecting to the instances tab */}
          <Redirect path="/" to="/instances/" />
          <Route
            path="/instances/"
            component={() => (
              <Instances
                config={this.props.config}
                instances={this.props.instances}
              />
            )}
          />
        </div>
        <div className="AppFooter">
          <Footer />
        </div>
        <ModalLoading
          modalIsOpen={true}
          config={this.props.config}
          instances={this.props.instances}
        />
      </div>
    );
  }
}

export default App;
