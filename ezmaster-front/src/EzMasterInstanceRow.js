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
          <a href="">all-projects-5</a>
        </td>
        <td>2018/03/05 14:46:05</td>
        <td>inistcnrs/lodex:8.18.0</td>
        <td>
          <Badge color="danger">Stopped</Badge>
          <Badge color="success">Running</Badge>
        </td>
        <td>
          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="stop-circle"
            tooltip={"Stop " + this.props.technicalName}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="play-circle"
            tooltip={"Start " + this.props.technicalName}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="trash"
            tooltip={"Delete " + this.props.technicalName}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="cog"
            tooltip={"Edit settings of " + this.props.technicalName}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="upload"
            tooltip={"Upload data to " + this.props.technicalName}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="link"
            tooltip={"Open the " + this.props.technicalName + " internal URL"}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="globe"
            tooltip={"Open the " + this.props.technicalName + " public URL"}
          />

          <EzMasterInstanceRowAction
            technicalName={this.props.technicalName}
            dataFolderSize={Math.random() * 5000}
            action="file"
            tooltip={"See the logs of " + this.props.technicalName}
          />
        </td>
      </tr>
    );
  }
}

export default EzMasterInstanceRow;
