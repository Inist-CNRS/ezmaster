import React, { Component } from "react";
import { Badge } from "reactstrap";

import "./InstanceBadgeStatus.css";

class InstanceBadgeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    //this.toggleStatus = this.toggleStatus.bind(this);
  }

  render() {
    return (
      <div className="ezmaster-instance-status">
        {!this.props.instance.changingState &&
          this.props.instance.running && <Badge color="success">Running</Badge>}
        {!this.props.instance.changingState &&
          !this.props.instance.running && <Badge color="danger">Stopped</Badge>}
        {this.props.instance.changingState && (
          <Badge color="secondary">
            {this.props.instance.running ? (
              <span>Stopping</span>
            ) : (
              <span>Starting</span>
            )}
          </Badge>
        )}
      </div>
    );
  }
}

export default InstanceBadgeStatus;
