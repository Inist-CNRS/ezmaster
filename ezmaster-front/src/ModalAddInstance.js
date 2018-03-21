import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  FormText,
  FormFeedback
} from "reactstrap";
import { Row, Col } from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Alert } from "reactstrap";

import "./ModalAddInstance.css";

class ModalAddInstance extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      errorLongName: "",
      errorApplication: "",
      errorTechnicalName: ""
    };

    this.handleChangeLongName = this.handleChangeLongName.bind(this);
    this.handleChangeApplication = this.handleChangeApplication.bind(this);
    this.handleChangeTechnicalName = this.handleChangeTechnicalName.bind(this);
  }

  handleChangeLongName(e) {
    if (!e.target.value) {
      this.setState({
        errorLongName: "The long name field is required."
      });
    } else {
      this.setState({
        errorLongName: ""
      });
    }
  }

  handleChangeApplication(e) {
    console.log("handleChangeApplication", e.target.value);
    // if (!e.target.value) {
    //   this.setState({
    //     errorLongName: 'The long name field is required.'
    //   });
    // } else {
    //   this.setState({
    //     errorLongName: ''
    //   });
    // }
  }

  handleChangeTechnicalName(e) {
    console.log("handleChangeTechnicalName", e.target.value);
    // if (!e.target.value) {
    //   this.setState({
    //     errorLongName: 'The long name field is required.'
    //   });
    // } else {
    //   this.setState({
    //     errorLongName: ''
    //   });
    // }
  }

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
              <Label for="emai-application">Application</Label>
              <InputGroup>
                <Input
                  type="select"
                  name="emai-application"
                  id="emai-application"
                >
                  <option value="">select an application…</option>
                  <option value="inistcnrs/lodex:8.18.0">
                    inistcnrs/lodex:8.18.0
                  </option>
                  <option value="inistcnrs/ezmaster-webserver:4.1.0">
                    inistcnrs/ezmaster-webserver:4.1.0
                  </option>
                </Input>

                <InputGroupAddon addonType="append">
                  <LinkContainer to="/applications/">
                    <Button color="secondary" className="emai-add-application">
                      <i className="fa fa-download" />
                    </Button>
                  </LinkContainer>
                  <UncontrolledTooltip
                    placement="top"
                    target=".emai-add-application"
                  >
                    Your application is not in the list? you can download
                    another.
                  </UncontrolledTooltip>
                </InputGroupAddon>
              </InputGroup>
              {this.state.errorApplication && (
                <Alert color="danger" className="rounded-0">
                  {this.state.errorApplication}
                </Alert>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="emai-longname">Long name</Label>
              <Input
                type="text"
                name="emai-longname"
                id="emai-longname"
                invalid={this.state.errorLongName}
                onChange={this.handleChangeLongName}
                onBlur={this.handleChangeLongName}
              />
              <FormFeedback invalid>This field is required</FormFeedback>
              <FormText>A free text, human-readable…</FormText>
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
                    invalid
                  />
                  <FormFeedback>This field is required.</FormFeedback>
                  <FormFeedback>
                    It should contains only lowercase and alpha-numeric
                    characters.
                  </FormFeedback>
                </Col>{" "}
                -
                <Col>
                  <Input type="text" name="emai-tn-s" id="emai-tn-s" invalid />
                  <FormFeedback>This field is required.</FormFeedback>
                  <FormFeedback>
                    It should contains only lowercase and alpha-numeric
                    characters.
                  </FormFeedback>
                </Col>{" "}
                -
                <Col>
                  <Input type="number" name="emai-tn-v" min="1" />
                </Col>
              </Row>
              <FormText>
                The technical name is used to identify the instance and to
                access the instance on the web. The first part could be a
                project, the second a study, and the last must be a positive
                number or could be empty.
              </FormText>

              {this.state.errorTechnicalName && (
                <Alert color="danger" className="rounded-0">
                  {this.state.errorTechnicalName}
                </Alert>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="emai-preview">Instance URL preview</Label>
              <Input
                type="text"
                readOnly
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
