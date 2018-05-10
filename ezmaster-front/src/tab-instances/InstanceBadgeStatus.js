import React, { Component } from "react";
import { Badge } from "reactstrap";

import {
  subscribeToInstanceStatus,
  unsubscribeToInstanceStatus
} from "../models/ModelInstances2.js";

import "./InstanceBadgeStatus.css";

class InstanceBadgeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instanceStarted: this.props.instance.running,
      instanceIntermediateStatus: false
    };

    //this.toggleStatus = this.toggleStatus.bind(this);
  }

  componentDidMount() {
    const self = this;
    subscribeToInstanceStatus(
      self.props.instance.technicalName,
      "InstanceBadgeStatus",
      (err, status, intermediate) => {
        self.setState({
          instanceStarted: status,
          instanceIntermediateStatus: intermediate
        });
      }
    );
  }
  componentWillUnmount() {
    const self = this;
    unsubscribeToInstanceStatus(
      self.props.instance.technicalName,
      "InstanceBadgeStatus"
    );
  }

  render() {
    return (
      <div className="ezmaster-instance-status">
        {!this.state.instanceIntermediateStatus &&
          this.state.instanceStarted && <Badge color="success">Running</Badge>}
        {!this.state.instanceIntermediateStatus &&
          !this.state.instanceStarted && <Badge color="danger">Stopped</Badge>}
        {this.state.instanceIntermediateStatus && (
          <Badge color="secondary">
            {this.state.instanceStarted ? (
              <span>Starting</span>
            ) : (
              <span>Stopping</span>
            )}
          </Badge>
        )}
      </div>
    );
  }
}

export default InstanceBadgeStatus;
