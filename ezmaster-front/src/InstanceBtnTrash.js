import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import prettyBytes from "pretty-bytes";

import "./InstanceBtnTrash.css";

class InstanceBtnTrash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTrash: false
    };

    this.toggleTrash = this.toggleTrash.bind(this);
  }

  toggleTrash() {
    this.setState({
      modalTrash: !this.state.modalTrash
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-trash"}
          onClick={this.toggleTrash}
        >
          <i
            className={"fa fa-trash"}
            id={this.props.instance.technicalName + "-trash"}
          />
        </Button>

        <Modal isOpen={this.state.modalTrash} toggle={this.toggleTrash}>
          <ModalHeader toggle={this.toggleTrash}>
            Confirm you want to delete{" "}
            <code>{this.props.instance.technicalName}</code>
          </ModalHeader>
          <ModalBody>
            You are going to delete the{" "}
            <code>{this.props.instance.technicalName}</code> instance.<br />
            It represents{" "}
            <strong>
              {prettyBytes(this.props.instance.dataFolderSize)}
            </strong>{" "}
            of data.
            <br />
            <br />
            Are you sure?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggleTrash}>
              Yes delete {this.props.instance.technicalName}
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleTrash}>
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
