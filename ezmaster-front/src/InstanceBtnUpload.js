import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import ModalWebdav from "./ModalWebdav.js";

import Dropzone from "react-dropzone";

import "react-keyed-file-browser/dist/react-keyed-file-browser.css";
import FileBrowser from "react-keyed-file-browser";
import Moment from "moment";

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
  }

  toggleModalUpload() {
    this.setState({
      modalIsOpenUpload: !this.state.modalIsOpenUpload
    });
  }
  toggleModalWebdav() {
    this.setState({
      modalIsOpenWebdav: !this.state.modalIsOpenWebdav
    });
  }

  onDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles, rejectedFiles);
    this.setState({
      files: acceptedFiles
    });
  }

  handleDeleteFile() {}

  render() {
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
                      onDeleteFile={this.handleDeleteFile.bind(this)}
                      files={[
                        {
                          key: "cat.png",
                          modified: +Moment().subtract(1, "hours"),
                          size: 1.5 * 1024 * 1024
                        },
                        {
                          key: "kitten.png",
                          modified: +Moment().subtract(3, "days"),
                          size: 545 * 1024
                        },
                        {
                          key: "elephant.png",
                          modified: +Moment().subtract(3, "days"),
                          size: 52 * 1024
                        }
                      ]}
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
          modalIsOpen={this.state.modalIsOpenWebdav}
          toggle={this.toggleModalWebdav}
        />
      </div>
    );
  }
}

export default InstanceBtnUpload;
