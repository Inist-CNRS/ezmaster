import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";

import {
  subscribeToInstanceStatus,
  unsubscribeToInstanceStatus,
  startInstance,
  stopInstance
} from "../models/ModelInstances2.js";

import "./InstanceBtnStartStop.css";

class InstanceBtnStartStop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instanceStarted: this.props.instance.running,
      btnDisabled: false
    };

    this.toggleStatus = this.toggleStatus.bind(this);
  }

  componentDidMount() {
    const self = this;
    subscribeToInstanceStatus(
      self.props.instance.containerId,
      "InstanceBtnStartStop",
      (err, status, intermediate) => {
        self.setState({ instanceStarted: status, btnDisabled: intermediate });
      }
    );
  }
  componentWillUnmount() {
    const self = this;
    unsubscribeToInstanceStatus(
      self.props.instance.containerId,
      "InstanceBtnStartStop"
    );
  }

  toggleStatus() {
    const self = this;

    // simulate a time when the status is undefined
    self.setState({ btnDisabled: true });
    if (self.state.instanceStarted) {
      stopInstance(self.props.instance.containerId, err => {
        if (err) {
          toast.error(
            <div>
              Instance <strong>{self.props.instance.technicalName}</strong>{" "}
              stopping error: {"" + err}
            </div>
          );
          toast.error(
            <div style={{ width: "30rem" }}>
              {renderHTML(err.response.data)}
            </div>
          );
        } else {
          toast.success(
            <div>
              Instance <strong>{self.props.instance.technicalName}</strong> has
              been stopped
            </div>
          );
        }
      });
    } else {
      startInstance(self.props.instance.containerId, (err, res) => {
        if (err) {
          toast.error(
            <div>
              Instance <strong>{self.props.instance.technicalName}</strong>{" "}
              starting error: {"" + err}
            </div>
          );
          toast.error(
            <div style={{ width: "30rem" }}>
              {renderHTML(err.response.data)}
            </div>
          );
        } else {
          toast.success(
            <div>
              Instance <strong>{self.props.instance.technicalName}</strong> has
              been started
            </div>
          );
        }
      });
    }
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
              !this.state.btnDisabled && !this.state.instanceStarted,
            "ezmaster-a-stop-circle":
              !this.state.btnDisabled && this.state.instanceStarted
          })}
          onClick={this.toggleStatus}
        >
          <i
            className={classnames({
              fa: true,
              "fa-spinner": this.state.btnDisabled,
              "fa-play-circle":
                !this.state.btnDisabled && !this.state.instanceStarted,
              "fa-stop-circle":
                !this.state.btnDisabled && this.state.instanceStarted
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
