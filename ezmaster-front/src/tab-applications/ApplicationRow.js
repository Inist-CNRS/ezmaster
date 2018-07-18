import React, { Component } from "react";
import moment from "moment-timezone";
import { UncontrolledTooltip } from "reactstrap";
import { prettyBytes } from "../helpers.js";
import ApplicationBtnTrash from "./ApplicationBtnTrash.js";

import "./ApplicationRow.css";

class ApplicationRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.application.imageName}</td>
        <td>
          <span id={"creationDate-" + this.props.application.imageId}>
            {moment.utc(this.props.application.creationDate).fromNow()}
          </span>
          <UncontrolledTooltip
            autohide={false}
            placement="right"
            target={"creationDate-" + this.props.application.imageId}
          >
            This application has been created exactly on{" "}
            <code>
              {moment
                .utc(this.props.application.creationDate)
                .tz(moment.tz.guess())
                .format("YYYY-MM-DD HH:mm:ss zz")}
            </code>
          </UncontrolledTooltip>
        </td>
        <td>{prettyBytes(this.props.application.image.Size)}</td>
        <td>
          <ApplicationBtnTrash
            application={this.props.application}
            applications={this.props.applications}
            className="ezmaster-a-a"
            classNameBtn="ezmaster-a-a-btn"
          />
        </td>
      </tr>
    );
  }
}

export default ApplicationRow;
