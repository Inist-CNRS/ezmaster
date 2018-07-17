import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { prettyBytes } from "../helpers.js";

import "./ApplicationBtnTrash.css";

class ApplicationBtnTrash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      deleteBtnDisabled: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.doDeleteApplication = this.doDeleteApplication.bind(this);
  }

  toggleModal() {
    const self = this;

    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  doDeleteApplication() {
    const self = this;

    self.setState({
      deleteBtnDisabled: true
    });

    // async instance delete

    self.props.applications.deleteApplication(
      self.props.application.imageName,
      function(err, res) {
        console.log('err', err, res);
        if (err) {
          toast.error(
            <div>
              {self.props.application.imageName} deleting error: {"" + err}
              <br/>
              {(err.response && err.response.data && err.response.data.json && err.response.data.json.message) ? err.response.data.json.message : ""}
            </div>
          );
        } else {
          toast.success(
            <div>
              {self.props.application.name} has been deleted{" "}
              <i className={"fa fa-trash"} />
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
            id={this.props.application.imageName + "-trash"}
          />
        </Button>

        <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            Confirm you want to delete{" "}
            this application ?
          </ModalHeader>
          <ModalBody>
            You are going to delete{" "}
            <code>{this.props.application.imageName}</code><br />
            It represents <strong>{prettyBytes(this.props.application.image.Size)}</strong> of
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
              onClick={this.doDeleteApplication}
              disabled={this.state.deleteBtnDisabled}
            >
              Yes delete {this.props.application.imageName}
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ApplicationBtnTrash;
