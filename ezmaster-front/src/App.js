import React, { Component } from "react";
import "./App.css";
import Header from "./Header.js";
import Content from "./Content.js";
import Footer from "./Footer.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="AppHeader">
          <Header />
        </div>
        <div className="AppContent">
          <Content />
        </div>
        <div className="AppFooter">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
