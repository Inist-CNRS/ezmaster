import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";

import "./InstanceBtnStartStop.css";

class InstanceBtnStartStop extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.toggleStatus = this.toggleStatus.bind(this);
  }

  toggleStatus() {
    const self = this;

    // simulate a time when the status is undefined
    if (self.props.instance.running) {
      self.props.instances.stopInstance(
        self.props.instance.containerId,
        err => {
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
                <i className="fa fa-stop-circle" /> Instance{" "}
                <strong>{self.props.instance.technicalName}</strong> has been
                stopped
              </div>
            );
          }
        }
      );
    } else {
      self.props.instances.startInstance(
        self.props.instance.containerId,
        (err, res) => {
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
                <i className="fa fa-play-circle" /> Instance{" "}
                <strong>{self.props.instance.technicalName}</strong> has been
                started
              </div>
            );
          }
        }
      );
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          disabled={this.props.instance.changingState}
          color="link"
          className={classnames(this.props.classNameBtn, {
            "ezmaster-startstop": true,
            "ezmaster-a-play-circle":
              !this.props.instance.changingState &&
              !this.props.instance.running,
            "ezmaster-a-stop-circle":
              !this.props.instance.changingState && this.props.instance.running
          })}
          onClick={this.toggleStatus}
        >
          <i
            className={classnames({
              fa: true,
              "fa-spinner": this.props.instance.changingState,
              "fa-play-circle":
                !this.props.instance.changingState &&
                !this.props.instance.running,
              "fa-stop-circle":
                !this.props.instance.changingState &&
                this.props.instance.running
            })}
            id={this.props.instance.technicalName + "-startstop"}
          />
        </Button>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-startstop"}
        >
          {!this.props.instance.changingState ? (
            <span>
              {this.props.instance.running ? "Stop" : "Start"}{" "}
              <code>{this.props.instance.technicalName}</code>
            </span>
          ) : (
            <span>
              {this.props.instance.running
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
