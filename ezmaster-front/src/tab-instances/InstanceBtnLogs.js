import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceBtnLogs.css";

class InstanceBtnLogs extends Component {
  render() {
    // ex: /-/v1/instances/lodex-istex-2/logs
    const logsUrl =
      "/-/v1/instances/" + this.props.instance.technicalName + "/logs";

    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-logs"}
        >
          <a href={logsUrl} target="_blank">
            <i
              className={"fa fa-file"}
              id={this.props.instance.technicalName + "-logs"}
            />
          </a>
        </Button>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-logs"}
        >
          See the logs of <code>{this.props.instance.technicalName}</code>
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnLogs;
