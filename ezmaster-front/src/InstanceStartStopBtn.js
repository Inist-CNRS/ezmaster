import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceStartStopBtn.css";

class InstanceStartStopBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instanceStarted: false,
      btnDisabled: false
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
          className={
            this.props.classNameBtn +
            " " +
            (this.state.instanceStarted
              ? "ezmaster-a-play-circle"
              : "ezmaster-a-stop-circle")
          }
          onClick={this.toggleStatus}
        >
          <i
            className={
              "fa" +
              " " +
              (this.state.instanceStarted ? "fa-play-circle" : "fa-stop-circle")
            }
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

export default InstanceStartStopBtn;
