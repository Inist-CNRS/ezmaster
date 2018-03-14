import React, { Component } from "react";
import { Table } from "reactstrap";
import "./Content.css";
import EzMasterInstanceRow from "./EzMasterInstanceRow.js";

class Content extends Component {
  render() {
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

      <Table striped={true} responsive={true}>
        <thead>
          <tr>
            <th>Long Name</th>
            <th>Technical Name</th>
            <th>Creation Date</th>
            <th>Application</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <EzMasterInstanceRow technicalName="dpi-project-1" />
          <EzMasterInstanceRow technicalName="dpi-project-2" />
          <EzMasterInstanceRow technicalName="dpi-project-3" />
        </tbody>
      </Table>
    );
  }
}

export default Content;
