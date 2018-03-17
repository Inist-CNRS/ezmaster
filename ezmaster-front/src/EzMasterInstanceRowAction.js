import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import prettyBytes from "pretty-bytes";

import "./EzMasterInstanceRowAction.css";

class EzMasterInstanceRowAction extends Component {
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
      <div className="ezmaster-a">
        <Button
          color="link"
          className={"ezmaster-a-btn ezmaster-a-" + this.props.action}
          onClick={this.toggleTrash}
        >
          <i
            className={"fa fa-" + this.props.action}
            id={this.props.technicalName + "-" + this.props.action}
          />
        </Button>
        {this.props.action == "trash" && (
          <Modal isOpen={this.state.modalTrash} toggle={this.toggleTrash}>
            <ModalHeader toggle={this.toggleTrash}>
              Confirm you want to delete <code>{this.props.technicalName}</code>
            </ModalHeader>
            <ModalBody>
              You are going to delete the{" "}
              <code>{this.props.technicalName}</code> instance.<br />
              It represents{" "}
              <strong>{prettyBytes(this.props.dataFolderSize)}</strong> of data.
              <br />
              <br />
              Are you sure?
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggleTrash}>
                Yes delete {this.props.technicalName}
              </Button>{" "}
              <Button color="secondary" onClick={this.toggleTrash}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        )}
        <UncontrolledTooltip
          placement="top"
          target={this.props.technicalName + "-" + this.props.action}
        >
          {this.props.tooltip}
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default EzMasterInstanceRowAction;
