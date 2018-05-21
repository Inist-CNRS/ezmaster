import React, { Component } from "react";
import shallowEqual from "fbjs/lib/shallowEqual";
import { Table } from "reactstrap";
import { Row, Col } from "reactstrap";
import { Button } from "reactstrap";
import { Helmet } from "react-helmet";

import "./Instances.css";
import InstanceRow from "./InstanceRow.js";
import ModalAddInstance from "./ModalAddInstance.js";

class Instances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddInstanceIsOpen: false
    };
    this.toggleModalAddInstance = this.toggleModalAddInstance.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.state, nextState)) {
      return true;
    }
    return ["config", "instances", "applications"].includes(
      nextProps.modelEvent
    );
  }

  toggleModalAddInstance() {
    this.setState({
      modalAddInstanceIsOpen: !this.state.modalAddInstanceIsOpen
    });
  }

  render() {
    const self = this;
    const instancesRows = [];
    Object.keys(self.props.instances.d).forEach(function(technicalName) {
      const instance = self.props.instances.d[technicalName];
      instancesRows.push(
        <InstanceRow
          config={self.props.config}
          instances={self.props.instances}
          key={technicalName}
          instance={instance}
        />
      );
    });

    return (
      <div className="ezmaster-instances">
        <Helmet>
          <title>EzMaster - Instances</title>
        </Helmet>
        {/* append a "add instance" button if the table items are more than 10 items so that it's easier to click on the button */}
        {instancesRows.length > 10 && (
          <Row>
            <Col>
              <Button
                className="ml-2 ezmaster-instances-add ezmaster-instances-add-top"
                color="primary"
                onClick={this.toggleModalAddInstance}
              >
                <i className="fa fa-plus-circle" /> Add instance
              </Button>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Table
              striped={true}
              responsive={true}
              className="ezmaster-instances-table"
            >
              <thead>
                <tr>
                  <th>Long name</th>
                  <th>Technical name</th>
                  <th>Creation date</th>
                  <th>Application</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{instancesRows}</tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="ml-2 ezmaster-instances-add"
              color="primary"
              onClick={this.toggleModalAddInstance}
            >
              <i className="fa fa-plus-circle" /> Add instance
            </Button>
            <ModalAddInstance
              config={this.props.config}
              modalIsOpen={this.state.modalAddInstanceIsOpen}
              applications={this.props.applications}
              instances={this.props.instances}
              toggle={this.toggleModalAddInstance}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Instances;
