import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { style } from "react-toastify";

import "./AppToastContainer.css";

style({
  width: "30rem",
  colorDefault: "#fff",
  colorInfo: "#117aff",
  colorSuccess: "#07bc0c",
  colorWarning: "#f1c40f",
  colorError: "#e74c3c",
  colorProgressDefault:
    "linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55)",
  mobile: "only screen and (max-width : 480px)",
  fontFamily: "sans-serif",
  zIndex: 9999,
  TOP_LEFT: {
    top: "1em",
    left: "1em"
  },
  TOP_CENTER: {
    top: "1em",
    marginLeft: `-${320 / 2}px`,
    left: "50%"
  },
  TOP_RIGHT: {
    top: "1em",
    right: "1em"
  },
  BOTTOM_LEFT: {
    bottom: "1em",
    left: "1em"
  },
  BOTTOM_CENTER: {
    bottom: "1em",
    marginLeft: `-${320 / 2}px`,
    left: "50%"
  },
  BOTTOM_RIGHT: {
    bottom: "1em",
    right: "1em"
  }
});

class AppToastContainer extends Component {
  componentDidMount() {
    setTimeout(function() {
      console.log("HELLO !!");
      toast.info(
        <div>
          <code>HELLO</code> has been deleted
        </div>
      );

      toast.warning(
        <div>
          <code>HELLO</code> has been deleted
        </div>
      );

      toast.error(
        <div>
          <code>HELLO</code> has been deleted
        </div>
      );

      toast(
        <div>
          <code>HELLO</code> has been deleted
        </div>
      );
    }, 1000);
  }

  render() {
    return <ToastContainer position="bottom-left" className="ezmaster-toast" />;
  }
}

export default AppToastContainer;
