import React, { Component } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./AppToastContainer.css";

class AppToastContainer extends Component {
  render() {
    return <ToastContainer position="bottom-left" />;
  }
}

export default AppToastContainer;
