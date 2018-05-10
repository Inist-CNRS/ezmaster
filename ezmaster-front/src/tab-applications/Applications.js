import React, { Component } from "react";
// import { Table } from "reactstrap";
// import { Row, Col } from "reactstrap";
// import { Button } from "reactstrap";
import { Helmet } from "react-helmet";

import "./Applications.css";

class Applications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddApplicationIsOpen: false
    };
    this.toggleModalAddApplication = this.toggleModalAddApplication.bind(this);
  }

  toggleModalAddApplication() {
    this.setState({
      modalAddApplicationIsOpen: !this.state.modalAddApplicationIsOpen
    });
  }

  render() {
    return (
      <div className="ezmaster-applications">
        <Helmet>
          <title>EzMaster - Applications</title>
        </Helmet>
        TODO APPLICATIONS
      </div>
    );
  }
}

export default Applications;
