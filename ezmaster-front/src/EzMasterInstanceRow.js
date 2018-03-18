import React, { Component } from "react";

import { Badge } from "reactstrap";

import "./EzMasterInstanceRow.css";
import EzMasterInstanceTrashBtn from "./EzMasterInstanceTrashBtn.js";
import EzMasterInstanceStartStopBtn from "./EzMasterInstanceStartStopBtn.js";
import EzMasterInstanceSettingsBtn from "./EzMasterInstanceSettingsBtn.js";
import EzMasterInstanceUploadBtn from "./EzMasterInstanceUploadBtn.js";
import EzMasterInstancePrivLinkBtn from "./EzMasterInstancePrivLinkBtn.js";
import EzMasterInstancePubLinkBtn from "./EzMasterInstancePubLinkBtn.js";
import EzMasterInstanceLogsBtn from "./EzMasterInstanceLogsBtn.js";

class EzMasterInstanceRow extends Component {
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
          <EzMasterInstanceStartStopBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <EzMasterInstanceTrashBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <EzMasterInstanceSettingsBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <EzMasterInstanceUploadBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <EzMasterInstancePrivLinkBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <EzMasterInstancePubLinkBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />

          <EzMasterInstanceLogsBtn
            instance={this.props.instance}
            className="ezmaster-a"
            classNameBtn="ezmaster-a-btn"
          />
        </td>
      </tr>
    );
  }
}

export default EzMasterInstanceRow;
