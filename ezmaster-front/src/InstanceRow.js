import React, { Component } from "react";

import { Badge } from "reactstrap";

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
        <td>Les projets du DPI</td>
        <td>
          <a href="">{this.props.instance.technicalName}</a>
        </td>
        <td>2018/03/05 14:46:05</td>
        <td>inistcnrs/lodex:8.18.0</td>
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
