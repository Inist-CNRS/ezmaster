import React, { Component } from "react";
import { Button } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceBtnPubLink.css";

class InstanceBtnPubLink extends Component {
  render() {
    const instancePubURL =
      this.props.config.d.publicProtocol +
      "://" +
      this.props.instance.technicalName +
      "." +
      this.props.config.d.publicDomain;
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-globe"}
          onClick={this.toggleModal}
          href={instancePubURL}
          disabled={!this.props.instance.running}
          target="_blank"
        >
          <i
            className={"fa fa-globe"}
            id={this.props.instance.technicalName + "-publink"}
          />
        </Button>

        <UncontrolledTooltip
          placement="bottom"
          target={this.props.instance.technicalName + "-publink"}
        >
          Open the <code>{this.props.instance.technicalName}</code> public URL
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnPubLink;
