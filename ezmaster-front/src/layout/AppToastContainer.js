import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { style } from "react-toastify";

import "./AppToastContainer.css";

style({
  width: "30rem",
  colorInfo: "#4aa8e8",
  colorSuccess: "#4a864a",
  colorWarning: "#eccc69",
  colorError: "#db3946"
});

class AppToastContainer extends Component {
  render() {
    return <ToastContainer position="bottom-left" className="ezmaster-toast" />;
  }
}

export default AppToastContainer;
