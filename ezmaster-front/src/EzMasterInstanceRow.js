import React, { Component } from "react";
import { Button } from "reactstrap";
import { Badge } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import "./EzMasterInstanceRow.css";

class EzMasterInstanceRow extends Component {
  render() {
    return (
      <tr>
        <td>Les projets du DPI</td>
        <td>
          <a href="#">all-projects-5</a>
        </td>
        <td>2018/03/05 14:46:05</td>
        <td>inistcnrs/lodex:8.18.0</td>
        <td>
          <Badge color="danger">Stopped</Badge>
          <Badge color="success">Running</Badge>
        </td>
        <td>
          <Button color="link" className="ezmaster-a ezmaster-a-stop">
            <i
              className="fa fa-stop-circle"
              id={this.props.technicalName + "-stop"}
            />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-stop"}
          >
            Stop <code>{this.props.technicalName}</code>
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-play">
            <i
              className="fa fa-play-circle"
              id={this.props.technicalName + "-play"}
            />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-play"}
          >
            Start <code>{this.props.technicalName}</code>
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-trash">
            <i
              className="fa fa-trash"
              id={this.props.technicalName + "-trash"}
            />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-trash"}
          >
            Delete <code>{this.props.technicalName}</code>
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-cog">
            <i className="fa fa-cog" id={this.props.technicalName + "-cog"} />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-cog"}
          >
            Edit settings of <code>{this.props.technicalName}</code>
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-upload">
            <i
              className="fa fa-upload"
              id={this.props.technicalName + "-upload"}
            />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-upload"}
          >
            Upload data to <code>{this.props.technicalName}</code>
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-link">
            <i className="fa fa-link" id={this.props.technicalName + "-link"} />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-link"}
          >
            Open the <code>{this.props.technicalName}</code> internal URL
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-globe">
            <i
              className="fa fa-globe"
              id={this.props.technicalName + "-globe"}
            />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-globe"}
          >
            Open the <code>{this.props.technicalName}</code> public URL
          </UncontrolledTooltip>

          <Button color="link" className="ezmaster-a ezmaster-a-file">
            <i className="fa fa-file" id={this.props.technicalName + "-file"} />
          </Button>
          <UncontrolledTooltip
            placement="top"
            target={this.props.technicalName + "-file"}
          >
            See the logs of <code>{this.props.technicalName}</code>
          </UncontrolledTooltip>
        </td>
      </tr>
    );
  }
}

export default EzMasterInstanceRow;
