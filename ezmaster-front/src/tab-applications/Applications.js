import React, { Component } from "react";
import { Table } from "reactstrap";
import { Row, Col } from "reactstrap";
import { Button } from "reactstrap";
import { Helmet } from "react-helmet";
import shallowEqual from "fbjs/lib/shallowEqual";

import "./Applications.css";
import ApplicationRow from "./ApplicationRow.js";
import ModalAddApplication from "./ModalAddApplication.js";

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
    return ["config", "applications", "ezMasterizedApps"].includes(
      nextProps.modelEvent
    );
  }

  toggleModalAddApplication() {
    this.setState({
      modalAddApplicationIsOpen: !this.state.modalAddApplicationIsOpen
    });
  }

  render() {
    const applicationsRows = [];
    this.props.applications.d.forEach((application, idx) => {
      applicationsRows.push(
        <ApplicationRow
          config={this.props.config}
          key={idx}
          application={application}
          applications={this.props.applications}
          usedApplications={this.props.usedApplications}
        />
      );
    });
    const emptyTable = this.props.applications.d.length === 0;

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

        <Row style={{ display: emptyTable ? "none" : "block" }}>
          <Col>
            <Table
              striped={true}
              responsive={true}
              className="ezmaster-applications-table"
            >
              <thead>
                <tr>
                  <th>Application name</th>
                  <th>Download date</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{applicationsRows}</tbody>
            </Table>
          </Col>
        </Row>
        <Row
          className={
            emptyTable
              ? "ezmaster-applications-add justify-content-md-center"
              : "ezmaster-applications-add"
          }
        >
          <Col className={emptyTable ? "col-md-auto" : ""}>
            <Button
              className="ml-2"
              color="primary"
              onClick={this.toggleModalAddApplication}
            >
              <i className="fa fa-plus-circle" /> Add application
            </Button>

            <ModalAddApplication
              config={this.props.config}
              modalIsOpen={this.state.modalAddApplicationIsOpen}
              applications={this.props.applications}
              ezMasterizedApps={this.props.ezMasterizedApps}
              instances={this.props.instances}
              toggle={this.toggleModalAddApplication}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Applications;
