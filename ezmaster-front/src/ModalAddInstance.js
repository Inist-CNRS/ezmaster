import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Row, Col } from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UncontrolledTooltip } from "reactstrap";

import "./ModalAddInstance.css";

class ModalAddInstance extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-add-instance"
      >
        <ModalHeader toggle={this.props.toggle}>
          Add a new EzMaster instance
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <LinkContainer to="/applications/">
                <Button
                  color="link"
                  className="emai-add-application float-right"
                >
                  <i className="fa fa-download" />
                </Button>
              </LinkContainer>
              <UncontrolledTooltip
                placement="top"
                target=".emai-add-application"
              >
                Your application is not in the list? you can download another.
              </UncontrolledTooltip>

              <Label for="emai-application">Application</Label>
              <Input
                type="select"
                name="emai-application"
                id="emai-application"
              >
                <option>select an application…</option>
                <option>inistcnrs/lodex:8.18.0</option>
                <option>inistcnrs/ezmaster-webserver:4.1.0</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="emai-longname">Long name</Label>
              <Input
                type="text"
                name="text"
                id="emai-longname"
                placeholder="A free text, human-readable…"
              />
            </FormGroup>

            <FormGroup>
              <Row>
                <Col>
                  <Label for="emai-technicalname">Technical name</Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Input
                    type="text"
                    name="emai-tn-p"
                    id="emai-technicalname"
                    placeholder="project…"
                  />
                </Col>
                <Col>
                  <Input
                    type="text"
                    name="emai-tn-s"
                    id="emai-tn-s"
                    placeholder="study…"
                  />
                </Col>
                <Col>
                  <Input
                    type="number"
                    name="emai-tn-v"
                    min="1"
                    placeholder="1…"
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Label for="emai-preview">Instance URL preview</Label>
              <Input
                type="text"
                readonly="readonly"
                id="emai-preview"
                placeholder="Generated URL…"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.props.toggle}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalAddInstance;
