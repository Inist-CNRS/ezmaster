import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceBtnLogs.css";

class InstanceBtnLogs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-file"}
        >
          <i
            className={"fa fa-file"}
            id={this.props.instance.technicalName + "-logs"}
          />
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
