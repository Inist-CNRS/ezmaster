import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./ModalWebdav.css";

class ModalWebdav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-webdav"
      >
        <ModalHeader toggle={this.props.toggle}>BLA BLA 1</ModalHeader>
        <ModalBody>BLA BLA 2</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalWebdav;
