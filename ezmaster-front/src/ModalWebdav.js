import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Container, Row, Col } from "reactstrap";

import windowsDrive from "./ModalWebdav-windows-drive.png";
import "./ModalWebdav.css";

class ModalWebdav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-webdav"
      >
        <ModalHeader toggle={this.props.toggle}>BLA BLA 1</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>Windows bla bla</Col>
              <Col>
                <img src={windowsDrive} width="300px" />
              </Col>
            </Row>
            <Row>
              <Col>Ubuntu bla bla</Col>
              <Col>
                <img src={windowsDrive} />
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalWebdav;
