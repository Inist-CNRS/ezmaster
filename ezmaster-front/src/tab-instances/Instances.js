import React, { Component } from "react";
import shallowEqual from "fbjs/lib/shallowEqual";
import { Table, Row, Col } from "reactstrap";
import { Button, Badge, UncontrolledTooltip } from "reactstrap";
import { Helmet } from "react-helmet";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";

import "./Instances.css";
import InstanceRow from "./InstanceRow.js";
import ModalAddInstance from "./ModalAddInstance.js";

class Instances extends Component {
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      modalAddInstanceIsOpen: false,
      showTechnicalInstances: cookies.get("showTechnicalInstances") || "no"
    };
    this.toggleModalAddInstance = this.toggleModalAddInstance.bind(this);
    this.toggleTechnicalInstances = this.toggleTechnicalInstances.bind(this);
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

  toggleTechnicalInstances() {
    const { cookies } = this.props;
    cookies.set(
      "showTechnicalInstances",
      this.state.showTechnicalInstances === "yes" ? "no" : "yes",
      { path: "/" }
    );
    this.setState({
      showTechnicalInstances:
        this.state.showTechnicalInstances === "yes" ? "no" : "yes"
    });
  }

  render() {
    const self = this;
    const instancesRows = [];
    let technicalApplicationsNb = 0;
    Object.keys(self.props.instances.d)
      .sort((a, b) => {
        return self.props.instances.d[a].creationDate >
          self.props.instances.d[b].creationDate
          ? -1
          : 1;
      })
      .forEach(function(technicalName) {
        const instance = self.props.instances.d[technicalName];

        // do not show technicalApplication if it has not been
        // requested by the user
        if (instance.technicalApplication) {
          technicalApplicationsNb++;
          if (self.state.showTechnicalInstances === "no") {
            return;
          }
        }

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
        {instancesRows.length + technicalApplicationsNb > 10 && (
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
                  <th>Size</th>
                  <th>
                    Application
                    {/* This is the technicalApplications button used to 
                        filter the instances list */}
                    {technicalApplicationsNb > 0 && (
                      <div className="ezm-technical-instances-filter">
                        <i
                          id="etif-btn"
                          className={
                            "fa fa-cog " +
                            (this.state.showTechnicalInstances === "yes"
                              ? "active"
                              : "")
                          }
                          onClick={this.toggleTechnicalInstances}
                        />&nbsp;
                        <Badge
                          id="etif-badge"
                          onClick={this.toggleTechnicalInstances}
                          className={
                            this.state.showTechnicalInstances === "yes"
                              ? "active"
                              : ""
                          }
                          color="warning"
                        >
                          {technicalApplicationsNb}
                        </Badge>
                        <UncontrolledTooltip
                          autohide={false}
                          placement="bottom"
                          target="etif-badge"
                        >
                          Click to display the {technicalApplicationsNb} hidden
                          technical instances.
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                          autohide={false}
                          placement="right"
                          target="etif-btn"
                        >
                          Show/hide ezmaster's technical instances (ex:
                          database)
                        </UncontrolledTooltip>
                      </div>
                    )}
                  </th>
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

Instances.propTypes = {
  cookies: instanceOf(Cookies).isRequired
};

export default withCookies(Instances);
