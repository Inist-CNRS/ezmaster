import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";

import "./InstanceBtnStartStop.css";

class InstanceBtnStartStop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instanceStarted: this.props.instance.status == "started",
      btnDisabled: this.props.instance.status === undefined
    };

    this.toggleStatus = this.toggleStatus.bind(this);
  }

  toggleStatus() {
    // simulate a time when the status is undefined
    this.setState({ btnDisabled: true });
    setTimeout(
      function() {
        this.setState({
          instanceStarted: !this.state.instanceStarted,
          btnDisabled: false
        });
      }.bind(this),
      1000
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          disabled={this.state.btnDisabled}
          color="link"
          className={classnames(this.props.classNameBtn, {
            "ezmaster-startstop": true,
            "ezmaster-a-play-circle":
              !this.state.btnDisabled && this.state.instanceStarted,
            "ezmaster-a-stop-circle":
              !this.state.btnDisabled && !this.state.instanceStarted
          })}
          onClick={this.toggleStatus}
        >
          <i
            className={classnames({
              fa: true,
              "fa-spinner": this.state.btnDisabled,
              "fa-play-circle":
                !this.state.btnDisabled && this.state.instanceStarted,
              "fa-stop-circle":
                !this.state.btnDisabled && !this.state.instanceStarted
            })}
            id={this.props.instance.technicalName + "-startstop"}
          />
        </Button>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-startstop"}
        >
          {!this.state.btnDisabled ? (
            <span>
              {this.state.instanceStarted ? "Stop" : "Start"}{" "}
              <code>{this.props.instance.technicalName}</code>
            </span>
          ) : (
            <span>
              {this.state.instanceStarted
                ? "Instance is stopping"
                : "Instance is starting"}
            </span>
          )}
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnStartStop;
