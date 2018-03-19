import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
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
              <Col>
                <h3>Webdav and windows</h3>
                <ListGroup>
                  <ListGroupItem>1. Create a new network drive</ListGroupItem>
                  <ListGroupItem>
                    2. As shown on the screenshot on the right, copy paste the
                    folowing webdav URL into the "Dossier" field.
                    <br />
                    <code>http://vp-dpi.intra.inist.fr:23556/</code>
                  </ListGroupItem>
                  <ListGroupItem>coucou</ListGroupItem>
                </ListGroup>
              </Col>
              <Col>
                <img src={windowsDrive} width="300px" />
              </Col>
            </Row>
            <Row>
              <Col>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Webdav and ubuntu</h3>
                <ListGroup>
                  <ListGroupItem>1. Open your file explorer</ListGroupItem>
                  <ListGroupItem>
                    2. Type CTRL+L and enter this URL in the input field
                    <br />
                    <code>dav://vp-dpi.intra.inist.fr:23556/</code>
                  </ListGroupItem>
                  <ListGroupItem>coucou</ListGroupItem>
                </ListGroup>
              </Col>
              <Col>
                <img src={windowsDrive} width="300px" />
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
