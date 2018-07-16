import React, { Component } from "react";
import moment from "moment";
import { UncontrolledTooltip } from "reactstrap";
import { prettyBytes } from "../helpers.js";

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
    const instanceURL = !this.props.config.publicDomain
      ? this.props.instance.publicURL
      : this.props.config.publicProtocol +
        "://" +
        this.props.instance.technicalName +
        "." +
        this.props.config.publicDomain;

    return (
      <tr>
        <td>{this.props.instance.longName}</td>
        <td>
          <a href={instanceURL} target="_blank">
            {this.props.instance.technicalName}
          </a>
        </td>
        <td>
          <span id={this.props.instance.technicalName + "-creationDate"}>
            {moment(
              this.props.instance.creationDate,
              "YYYY/MM/DD HH:mm:ss"
            ).fromNow()}
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
        <td>{prettyBytes(this.props.instance.rawSize)}</td>
        <td>
          {this.props.instance.app}
          {this.props.instance.technicalApplication ? (
            <i className="fa fa-cog" style={{ marginLeft: "10px" }} />
          ) : (
            ""
          )}
        </td>
        <td>
          <InstanceBadgeStatus
            config={this.props.config}
            instances={this.props.instances}
            instance={this.props.instance}
          />
        </td>
        <td>
          <InstanceBtnStartStop
            config={this.props.config}
            instances={this.props.instances}
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnTrash
            config={this.props.config}
            instances={this.props.instances}
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnSettings
            config={this.props.config}
            instances={this.props.instances}
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnUpload
            config={this.props.config}
            instances={this.props.instances}
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceBtnPrivLink
            config={this.props.config}
            instances={this.props.instances}
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          {this.props.config.publicDomain && (
            <InstanceBtnPubLink
              config={this.props.config}
              instances={this.props.instances}
              instance={this.props.instance}
              className="ezmaster-a"
              classNameBtn="ezmaster-a-btn"
            />
          )}

          <InstanceBtnLogs
            config={this.props.config}
            instances={this.props.instances}
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
