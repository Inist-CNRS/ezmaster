import React, { Component } from "react";
import moment from "moment";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceRow.css";
import InstanceBtnTrash from "./InstanceBtnTrash.js";
import InstanceBtnStartStop from "./InstanceBtnStartStop.js";
import InstanceBtnSettings from "./InstanceBtnSettings.js";
import InstanceBtnUpload from "./InstanceBtnUpload.js";
import InstanceBtnPrivLink from "./InstanceBtnPrivLink.js";
import InstanceBtnPubLink from "./InstanceBtnPubLink.js";
import InstanceBtnLogs from "./InstanceBtnLogs.js";
import InstanceBadgeStatus from "./InstanceBadgeStatus.js";

class InstanceRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.instance.longName}</td>
        <td>
          <a href="">{this.props.instance.technicalName}</a>
        </td>
        <td>
          <span id={this.props.instance.technicalName + "-creationDate"}>
            {moment(this.props.instance.creationDate).fromNow()}
          </span>
          <UncontrolledTooltip
            autohide={false}
            placement="right"
            target={this.props.instance.technicalName + "-creationDate"}
          >
            This instance has been created exactly on{" "}
            <code>{this.props.instance.creationDate}</code>
          </UncontrolledTooltip>
        </td>
        <td>{this.props.instance.application}</td>
        <td>
          <InstanceBadgeStatus instance={this.props.instance} />
        </td>
        <td>
          <InstanceBtnStartStop
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnTrash
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnSettings
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnUpload
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnPrivLink
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnPubLink
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnLogs
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />
        </td>
      </tr>
    );
  }
}

export default InstanceRow;
