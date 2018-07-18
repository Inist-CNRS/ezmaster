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

    const deleteBtnUseless =
      this.props.usedApplications.find(
        app => app === this.props.application.imageName
      ) !== undefined;
    const imageHash = new Buffer(this.props.application.imageName).toString(
      "base64"
    );
    this.state = {
      modalIsOpen: false,
      deleteBtnDisabled: false,
      deleteBtnUseless,
      imageHash
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.doDeleteApplication = this.doDeleteApplication.bind(this);
  }

  toggleModal() {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  doDeleteApplication() {
    this.setState({
      deleteBtnDisabled: true
    });

    this.props.applications.deleteApplication(
      this.state.imageHash,
      (err, res) => {
        if (err) {
          toast.error(
            <div>
              {this.props.application.imageName} deleting error: {"" + err}
              <br />
              {err.response &&
              err.response.data &&
              err.response.data.json &&
              err.response.data.json.message
                ? err.response.data.json.message
                : ""}
            </div>
          );
        } else {
          toast.success(
            <div>
              {this.props.application.name} has been deleted{" "}
              <i className={"fa fa-trash"} />
            </div>
          );
        }
        // hide the popup
        this.setState({
          modalIsOpen: !this.state.modalIsOpen,
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
          disabled={this.state.deleteBtnUseless}
        >
          <i
            className={"fa fa-trash"}
            id={this.state.imageHash.slice(0, -2) + "-trash"}
          />
        </Button>

        <Modal
          isOpen={this.state.modalIsOpen}
          toggle={this.toggleModal}
          autoFocus={false}
        >
          <ModalHeader toggle={this.toggleModal}>
            Confirm you want to delete this application ?
          </ModalHeader>
          <ModalBody>
            You are going to delete{" "}
            <code>{this.props.application.imageName}</code>
            <br />
            It represents{" "}
            <strong>{prettyBytes(this.props.application.image.Size)}</strong> of
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
              autoFocus={true}
              onClick={this.doDeleteApplication}
              disabled={this.state.deleteBtnDisabled}
            >
              Yes delete {this.props.application.imageName}
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <UncontrolledTooltip
          placement="top"
          target={this.state.imageHash.slice(0, -2) + "-trash"}
        >
          Delete <code>{this.props.application.imageName}</code>
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default ApplicationBtnTrash;
