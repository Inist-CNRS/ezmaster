import React, { Component } from "react";

import { Badge } from "reactstrap";

import "./InstanceRow.css";
import InstanceTrashBtn from "./InstanceTrashBtn.js";
import InstanceStartStopBtn from "./InstanceStartStopBtn.js";
import InstanceSettingsBtn from "./InstanceSettingsBtn.js";
import InstanceUploadBtn from "./InstanceUploadBtn.js";
import InstancePrivLinkBtn from "./InstancePrivLinkBtn.js";
import InstancePubLinkBtn from "./InstancePubLinkBtn.js";
import InstanceLogsBtn from "./InstanceLogsBtn.js";

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
          <Badge color="danger">Stopped</Badge>
          <Badge color="success">Running</Badge>
        </td>
        <td>
          <InstanceStartStopBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceTrashBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceSettingsBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceUploadBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstancePrivLinkBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstancePubLinkBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <InstanceLogsBtn
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
