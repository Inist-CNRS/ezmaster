import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./InstanceSettingsBtn.css";

class InstanceSettingsBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-cog"}
          onClick={this.toggleModal}
        >
          <i
            className={"fa fa-cog"}
            id={this.props.instance.technicalName + "-cog"}
          />
        </Button>

        <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Hello</ModalHeader>
          <ModalBody>TODO</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>
              XXXX
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleModal}>
              YYY
            </Button>
          </ModalFooter>
        </Modal>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-cog"}
        >
          Edit settings of <code>{this.props.instance.technicalName}</code>
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceSettingsBtn;
