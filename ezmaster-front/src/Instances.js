import React, { Component } from "react";
import { Table } from "reactstrap";
import "./Instances.css";
import InstanceRow from "./InstanceRow.js";

class Instances extends Component {
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
        className="ezmaster-instances-content"
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

export default Instances;
