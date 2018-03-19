import React, { Component } from "react";

import { Badge } from "reactstrap";
import { Progress } from "reactstrap";
import "./InstanceBadgeStatus.css";

class InstanceBadgeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instanceStarted: this.props.instance.status == "started",
      instanceIntermediateStatus: this.props.instance.status === undefined
    };

    //this.toggleStatus = this.toggleStatus.bind(this);
  }

  render() {
    return (
      <div>
        {!this.state.instanceIntermediateStatus &&
          this.state.instanceStarted && <Badge color="success">Running</Badge>}
        {!this.state.instanceIntermediateStatus &&
          !this.state.instanceStarted && <Badge color="danger">Stopped</Badge>}
        {this.state.instanceIntermediateStatus && (
          <Badge color="secondary">...</Badge>
        )}
      </div>
    );
  }
}

export default InstanceBadgeStatus;
