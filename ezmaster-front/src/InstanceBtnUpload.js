import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Container, Row, Col } from "reactstrap";

import Dropzone from "react-dropzone";

import "./InstanceBtnUpload.css";

class InstanceBtnUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      files: []
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  onDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles, rejectedFiles);
    this.setState({
      files: acceptedFiles
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-upload"}
          onClick={this.toggleModal}
        >
          <i
            className={"fa fa-upload"}
            id={this.props.instance.technicalName + "-upload"}
          />
        </Button>

        <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Hello2</ModalHeader>
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
                <Col>
                  <div>COUCOU</div>
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>
              XXXX2
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleModal}>
              YYY2
            </Button>
          </ModalFooter>
        </Modal>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-upload"}
        >
          Upload data to <code>{this.props.instance.technicalName}</code>
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnUpload;
