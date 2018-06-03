import React, { Component } from "react";
import { Table } from "reactstrap";
import { Row, Col } from "reactstrap";
import { Button } from "reactstrap";
import { Helmet } from "react-helmet";
import shallowEqual from "fbjs/lib/shallowEqual";

import "./Applications.css";
import ApplicationRow from "./ApplicationRow.js";

class Applications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddApplicationIsOpen: false
    };
    this.toggleModalAddApplication = this.toggleModalAddApplication.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.state, nextState)) {
      return true;
    }
    return ["config", "applications"].includes(nextProps.modelEvent);
  }

  toggleModalAddApplication() {
    this.setState({
      modalAddApplicationIsOpen: !this.state.modalAddApplicationIsOpen
    });
  }

  render() {
    const self = this;
    const applicationsRows = [];
    self.props.applications.d.forEach(function(application, idx) {
      applicationsRows.push(
        <ApplicationRow
          config={self.props.config}
          key={idx}
          application={application}
        />
      );
    });

    return (
      <div className="ezmaster-applications">
        <Helmet>
          <title>EzMaster - Applications</title>
        </Helmet>
        {/* append a "add application" button if the table items are more than 10 items so that it's easier to click on the button */}
        {applicationsRows.length > 10 && (
          <Row>
            <Col>
              <Button
                className="ml-2 ezmaster-applications-add ezmaster-applications-add-top"
                color="primary"
                onClick={this.toggleModalAddApplication}
              >
                <i className="fa fa-plus-circle" /> Add application
              </Button>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Table
              striped={true}
              responsive={true}
              className="ezmaster-applications-table"
            >
              <thead>
                <tr>
                  <th>Application name</th>
                  <th>Creation date</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{applicationsRows}</tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="ml-2 ezmaster-applications-add"
              color="primary"
              onClick={this.toggleModalAddApplication}
            >
              <i className="fa fa-plus-circle" /> Add application
            </Button>

            {/*
            <ModalAddInstance
              config={this.props.config}
              modalIsOpen={this.state.modalAddInstanceIsOpen}
              applications={this.props.applications}
              instances={this.props.instances}
              toggle={this.toggleModalAddInstance}
            />
*/}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Applications;
