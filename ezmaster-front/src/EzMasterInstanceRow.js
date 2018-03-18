import React, { Component } from "react";

import { Badge } from "reactstrap";

import "./EzMasterInstanceRow.css";
import EzMasterInstanceRowAction from "./EzMasterInstanceRowAction.js";

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
          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="stop-circle"
            tooltip={"Stop " + this.props.instance.technicalName}
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="play-circle"
            tooltip={"Start " + this.props.instance.technicalName}
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="trash"
            tooltip={"Delete " + this.props.instance.technicalName}
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="cog"
            tooltip={"Edit settings of " + this.props.instance.technicalName}
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="upload"
            tooltip={"Upload data to " + this.props.instance.technicalName}
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="link"
            tooltip={
              "Open the " + this.props.instance.technicalName + " internal URL"
            }
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="globe"
            tooltip={
              "Open the " + this.props.instance.technicalName + " public URL"
            }
          />

          <EzMasterInstanceRowAction
            instance={this.props.instance}
            action="file"
            tooltip={"See the logs of " + this.props.instance.technicalName}
          />
        </td>
      </tr>
    );
  }
}

export default EzMasterInstanceRow;
