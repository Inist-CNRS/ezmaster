import React, { Component } from "react";
import { Table } from "reactstrap";
import "./Content.css";
import InstanceRow from "./InstanceRow.js";

class Content extends Component {
  render() {
    // fake ezmaster instances data
    const instances = [
      {
        technicalName: "dpi-project-1",
        dataFolderSize: Math.random() * 5000,
        status: "started"
      },
      {
        technicalName: "dpi-project-2",
        dataFolderSize: Math.random() * 5000,
        status: "stopped"
      },
      {
        technicalName: "dpi-project-3",
        dataFolderSize: Math.random() * 5000,
        status: undefined
      }
    ];

    const instancesRows = [];
    instances.forEach(function(instance) {
      instancesRows.push(<InstanceRow instance={instance} />);
    });

    return (
      // <Container>
      //   <Row>
      //     <Col>
      //       {/* to test font-awesome with reactjs */}
      //       <i className="fa fa-user fa-4x" />
      //       &nbsp;
      //       <i className="fa fa-github-square fa-4x" />
      //     </Col>
      //   </Row>
      // </Container>

      <Table
        striped={true}
        responsive={true}
        className="ezmaster-instance-content"
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
    );
  }
}

export default Content;
