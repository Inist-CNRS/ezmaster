import React, { Component } from "react";
import { Table } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { Button } from "reactstrap";

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

  toggleModalAddInstance() {
    this.setState({
      modalAddInstanceIsOpen: !this.state.modalAddInstanceIsOpen
    });
  }

  render() {
    // fake ezmaster instances data
    const instances = [
      {
        longName: "Les projets du DPI",
        technicalName: "dpi-project-1",
        application: "inistcnrs/lodex:8.18.0",
        dataFolderSize: Math.random() * 5000,
        creationDate: "2018/03/05 14:46:05",
        status: "started"
      },
      {
        longName: "Les projets du DLP",
        technicalName: "dpi-project-2",
        application: "inistcnrs/lodex:8.18.0",
        dataFolderSize: Math.random() * 5000,
        creationDate: "2018/03/03 14:46:05",
        status: "stopped"
      },
      {
        longName: "Les projets du DAI",
        technicalName: "dpi-project-3",
        application: "inistcnrs/lodex:8.18.0",
        dataFolderSize: Math.random() * 5000,
        creationDate: "2017/03/05 14:46:05",
        status: undefined
      }
    ];

    const instancesRows = [];
    instances.forEach(function(instance) {
      instancesRows.push(<InstanceRow instance={instance} />);
    });

    return (
      <div className="ezmaster-instances">
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
              modalIsOpen={this.state.modalAddInstanceIsOpen}
              toggle={this.toggleModalAddInstance}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Instances;
