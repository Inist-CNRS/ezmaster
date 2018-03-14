import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import "./EzMasterInstanceRowAction.css";

class EzMasterInstanceRowAction extends Component {
  render() {
    return (
      <div className="ezmaster-a">
        <Button
          color="link"
          className={"ezmaster-a-btn ezmaster-a-" + this.props.action}
        >
          <i
            className={"fa fa-" + this.props.action}
            id={this.props.technicalName + "-" + this.props.action}
          />
        </Button>

        <UncontrolledTooltip
          placement="top"
          target={this.props.technicalName + "-" + this.props.action}
        >
          {this.props.tooltip}
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default EzMasterInstanceRowAction;
