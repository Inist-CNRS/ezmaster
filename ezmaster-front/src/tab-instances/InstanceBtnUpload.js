import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";

import ModalWebdav from "./ModalWebdav.js";

import Dropzone from "react-dropzone";

import "react-keyed-file-browser/dist/react-keyed-file-browser.css";
import FileBrowser from "react-keyed-file-browser";

import "./InstanceBtnUpload.css";

class InstanceBtnUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpenUpload: false,
      modalIsOpenWebdav: false,
      files: []
    };

    this.toggleModalUpload = this.toggleModalUpload.bind(this);
    this.toggleModalWebdav = this.toggleModalWebdav.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
  }

  toggleModalUpload() {
    const self = this;

    if (this.state.modalIsOpenUpload) {
      // close it !
      this.setState({ modalIsOpenUpload: false });
      self.props.instances.refreshInstances();
    } else {
      // open it !
      self.props.instances.fetchInstanceData(this.props.instance.containerId);
      this.setState({ modalIsOpenUpload: true });
    }
  }
  toggleModalWebdav() {
    this.setState({
      modalIsOpenWebdav: !this.state.modalIsOpenWebdav
    });
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const self = this;

    self.props.instances.uploadFilesToInstanceData(
      self.props.instance.containerId,
      acceptedFiles,
      (err, fileName) => {
        if (err) {
          toast.error(
            <div>
              Upload error on{" "}
              <strong>{self.props.instance.technicalName}</strong> error:{" "}
              {"" + err}
            </div>
          );
        } else {
          toast.success(
            <div>
              Upload "{fileName}" success on{" "}
              <strong>{self.props.instance.technicalName}</strong>{" "}
              <i className="fa fa-upload" />
            </div>
          );
        }
      }
    );
  }

  handleDeleteFile(fileName) {
    const self = this;

    self.props.instances.deleteFileOnInstanceData(
      self.props.instance.containerId,
      fileName,
      err => {
        if (err) {
          toast.error(
            <div>
              Unable to delete "{fileName}" on{" "}
              <strong>{self.props.instance.technicalName}</strong> error:{" "}
              {"" + err}
            </div>
          );
        } else {
          toast.success(
            <div>
              File "{fileName}"" has been deleted on{" "}
              <strong>{self.props.instance.technicalName}</strong>{" "}
              <i className="fa fa-delete" />
            </div>
          );
        }
      }
    );
  }

  render() {
    const self = this;

    const fileBrowserFiles = !self.props.instance.data
      ? []
      : Object.keys(self.props.instance.data).map(filename => {
          return {
            key: filename,
            //modified: self.props.instance.data[filename].modified,
            // could be a better code if calculated from raw numeric bytes
            size:
              typeof self.props.instance.data[filename].size === "string"
                ? self.props.instance.data[filename].size.replace("B", "")
                : self.props.instance.data[filename].size
          };
        });

    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-upload"}
          onClick={this.toggleModalUpload}
        >
          <i
            className={"fa fa-upload"}
            id={this.props.instance.technicalName + "-upload"}
          />
        </Button>

        <Modal
          isOpen={this.state.modalIsOpenUpload}
          toggle={this.toggleModalUpload}
          className="ezmaster-modal-upload"
        >
          <ModalHeader toggle={this.toggleModalUpload}>
            Upload data to <code>{this.props.instance.technicalName}</code>
          </ModalHeader>
          <ModalBody>
            <Container>
              <Row>
                <Col>
                  <Dropzone
                    onDrop={this.onDrop.bind(this)}
                    className="ezmaster-instance-dropzone"
                  >
                    <div className="btn btn-link">
                      <i className={"fa fa-cloud-upload"} />
                    </div>
                    <br />
                    <div className="btn btn-primary">Choose file to upload</div>
                    <div>or drag and drop them here.</div>
                  </Dropzone>
                </Col>
                <Col className="ezmaster-instance-webdav">
                  <div
                    className="btn btn-link"
                    onClick={this.toggleModalWebdav}
                  >
                    <i className={"fa fa-folder-open"} />
                  </div>
                  <br />
                  <Button
                    color="primary"
                    className="modal-webdav-btn"
                    onClick={this.toggleModalWebdav}
                  >
                    Upload file with Webdav
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="ezmaster-instance-filelist">
                    <FileBrowser
                      showActionBar={true}
                      detailRenderer={() => {
                        return null;
                      }}
                      onDeleteFile={this.handleDeleteFile.bind(this)}
                      files={fileBrowserFiles}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalUpload}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-upload"}
        >
          Upload data to <code>{this.props.instance.technicalName}</code>
        </UncontrolledTooltip>

        <ModalWebdav
          config={this.props.config}
          instance={this.props.instance}
          modalIsOpen={this.state.modalIsOpenWebdav}
          toggle={this.toggleModalWebdav}
        />
      </div>
    );
  }
}

export default InstanceBtnUpload;
