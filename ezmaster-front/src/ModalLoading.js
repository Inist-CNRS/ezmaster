import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Row, Col } from "reactstrap";

import "./ModalLoading.css";

class ModalLoading extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-add-instance"
      >
        <ModalHeader toggle={this.props.toggle}>
          Loading EzMaster's data
        </ModalHeader>

        <ModalBody>TODO</ModalBody>
        <ModalFooter>
          <p className="text-center">
            Loading EzMaster's date.<br />
            Please wait.
          </p>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalLoading;
