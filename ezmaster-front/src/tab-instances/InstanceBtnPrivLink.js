import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceBtnPrivLink.css";

class InstanceBtnPrivLink extends Component {
  render() {
    const instancePrivURL = this.props.instance.publicURL;

    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-link"}
          onClick={this.toggleModal}
        >
          <a href={instancePrivURL} target="_blank">
            <i
              className={"fa fa-link"}
              id={this.props.instance.technicalName + "-privlink"}
            />
          </a>
        </Button>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-privlink"}
        >
          Open the <code>{this.props.instance.technicalName}</code> internal URL
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnPrivLink;
