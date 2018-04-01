import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { fetchInstanceDetail } from "./ModelInstances2.js";

import "./InstanceBtnTrash.css";

class InstanceBtnTrash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      dataFolderSize: 0
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    let self = this;

    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });

    // update the instance data folder size just when the popup is open
    if (!this.state.modalIsOpen) {
      fetchInstanceDetail(self.props.instance.containerId, function(err, data) {
        self.setState({ dataFolderSize: data.size });
      });
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-trash"}
          onClick={this.toggleModal}
        >
          <i
            className={"fa fa-trash"}
            id={this.props.instance.technicalName + "-trash"}
          />
        </Button>

        <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            Confirm you want to delete{" "}
            <code>{this.props.instance.technicalName}</code>
          </ModalHeader>
          <ModalBody>
            You are going to delete the{" "}
            <code>{this.props.instance.technicalName}</code> instance.<br />
            It represents <strong>{this.state.dataFolderSize}</strong> of data.
            <br />
            <br />
            Are you sure?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggleModal}>
              Yes delete {this.props.instance.technicalName}
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-trash"}
        >
          Delete <code>{this.props.instance.technicalName}</code>
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnTrash;
