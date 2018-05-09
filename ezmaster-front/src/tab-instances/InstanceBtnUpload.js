import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import ModalWebdav from "./ModalWebdav.js";
import {
  uploadFilesToInstanceData,
  fetchInstanceData
} from "../models/ModelInstances2.js";

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
    const self = this;

    fetchInstanceData(this.props.instance.containerId, (err, data) => {
      const fileBrowserFiles = Object.keys(data).map(filename => {
        return {
          key: filename,
          //modified: Moment(),
          // could be a better code if calculated from raw numeric bytes
          size: data[filename].size.replace("B", "")
        };
      });
      self.setState({ files: fileBrowserFiles });
    });

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

    uploadFilesToInstanceData(
      this.props.instance.containerId,
      acceptedFiles,
      function() {}
    );

    const fileBrowserFiles = acceptedFiles.map(item => {
      return {
        key: item.name,
        modified: Moment(item.lastModified),
        size: item.size
      };
    });

    this.setState({
      files: [...this.state.files, ...fileBrowserFiles]
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
                      detailRenderer={() => {
                        return null;
                      }}
                      onDeleteFile={this.handleDeleteFile.bind(this)}
                      files={this.state.files}
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
