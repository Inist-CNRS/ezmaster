import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";

import "./InstanceBtnTrash.css";

class InstanceBtnTrash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      deleteBtnDisabled: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.doDeleteInstance = this.doDeleteInstance.bind(this);
  }

  toggleModal() {
    const self = this;

    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });

    // update the instance data folder size just when the popup is open
    if (!this.state.modalIsOpen) {
      this.props.instances.fetchInstanceDetail(
        self.props.instance.containerId,
        err => {
          if (err) {
            toast.error(
              <div>
                Instance featching detail error: <br /> {err}
              </div>
            );
          }
        }
      );
    }
  }

  doDeleteInstance() {
    const self = this;

    self.setState({
      deleteBtnDisabled: true
    });

    // async instance delete
    self.props.instances.deleteInstance(
      self.props.instance.containerId,
      function(err) {
        if (err) {
          toast.error(
            <div>
              {self.props.instance.technicalName} deleting error: {"" + err}
            </div>
          );
        } else {
          toast.success(
            <div>
              <i className={"fa fa-trash"} />{" "}
              {self.props.instance.technicalName} has been deleted{" "}
            </div>
          );
        }
        // hide the popup
        self.setState({
          modalIsOpen: !self.state.modalIsOpen,
          deleteBtnDisabled: false
        });
      }
    );
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
            It represents <strong>{this.props.instance.detail.size}</strong> of
            data.
            <br />
            <br />
            Are you sure?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={this.doDeleteInstance}
              disabled={this.state.deleteBtnDisabled}
            >
              Yes delete {this.props.instance.technicalName}
            </Button>{" "}
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
