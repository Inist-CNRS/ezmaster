import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./ModalAddInstance.css";

class ModalAddInstance extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-add-instance"
      >
        <ModalHeader toggle={this.props.toggle}>
          Add a new EzMaster instance
        </ModalHeader>
        <ModalBody />
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.props.toggle}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalAddInstance;
