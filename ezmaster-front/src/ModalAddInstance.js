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
    publicDomain: "monsite.fr",
    toggle: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      technicalName1: "___",
      technicalName2: "___",
      technicalName3: "",
      technicalName: "___-___",
      errorRequiredLongName: false,
      errorRequiredApplication: false,
      errorRequiredTechnicalName1: false,
      errorSyntaxTechnicalName1: false,
      errorRequiredTechnicalName2: false,
      errorSyntaxTechnicalName2: false
    };

    this.handleChangeLongName = this.handleChangeLongName.bind(this);
    this.handleChangeApplication = this.handleChangeApplication.bind(this);
    this.handleChangeTechnicalName1 = this.handleChangeTechnicalName1.bind(
      this
    );
    this.handleChangeTechnicalName2 = this.handleChangeTechnicalName2.bind(
      this
    );
    this.handleChangeTechnicalName3 = this.handleChangeTechnicalName3.bind(
      this
    );
  }

  handleChangeLongName(e) {
    this.setState({
      errorRequiredLongName: e.target.value == ""
    });
  }

  handleChangeApplication(e) {
    console.log("EEEEEEEEEEEEE", e.target.value);
    this.setState({
      errorRequiredApplication: e.target.value == ""
    });
  }

  handleChangeTechnicalName1(e) {
    let newState = {
      errorRequiredTechnicalName1: e.target.value == "",
      errorSyntaxTechnicalName1: !RegExp("^[a-z0-9]*$", "g").test(
        e.target.value
      )
    };
    newState.technicalName1 = e.target.value;
    newState.technicalName =
      newState.technicalName1 +
      "-" +
      this.state.technicalName2 +
      (this.state.technicalName3 ? "-" + this.state.technicalName3 : "");
    this.setState(newState);
  }
  handleChangeTechnicalName2(e) {
    let newState = {
      errorRequiredTechnicalName2: e.target.value == "",
      errorSyntaxTechnicalName2: !RegExp("^[a-z0-9]*$", "g").test(
        e.target.value
      )
    };
    newState.technicalName2 = e.target.value;
    newState.technicalName =
      this.state.technicalName1 +
      "-" +
      newState.technicalName2 +
      (this.state.technicalName3 ? "-" + this.state.technicalName3 : "");
    this.setState(newState);
  }
  handleChangeTechnicalName3(e) {
    let newState = {};
    newState.technicalName3 = e.target.value;
    newState.technicalName =
      this.state.technicalName1 +
      "-" +
      this.state.technicalName2 +
      (newState.technicalName3 ? "-" + newState.technicalName3 : "");
    this.setState(newState);
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
                  onChange={this.handleChangeApplication}
                  onBlur={this.handleChangeApplication}
                  invalid={this.state.errorRequiredApplication}
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
              {this.state.errorRequiredApplication && (
                <FormText color="danger">This field is required.</FormText>
              )}
              <FormText>
                Choose an application in the list or start downloading the one
                you want.
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label for="emai-longname">Long name</Label>
              <Input
                type="text"
                name="emai-longname"
                id="emai-longname"
                invalid={this.state.errorRequiredLongName}
                onChange={this.handleChangeLongName}
                onBlur={this.handleChangeLongName}
              />
              {this.state.errorRequiredLongName && (
                <FormFeedback>This field is required.</FormFeedback>
              )}
              <FormText>A free text, a title, human-readable…</FormText>
            </FormGroup>

            <FormGroup>
              <Row>
                <Col>
                  <Label for="emai-tn-p">Technical name</Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Input
                    type="text"
                    name="emai-tn-p"
                    id="emai-tn-p"
                    onChange={this.handleChangeTechnicalName1}
                    onBlur={this.handleChangeTechnicalName1}
                    invalid={
                      this.state.errorRequiredTechnicalName1 ||
                      this.state.errorSyntaxTechnicalName1
                    }
                  />
                  {this.state.errorRequiredTechnicalName1 && (
                    <FormFeedback>This field is required.</FormFeedback>
                  )}
                  {this.state.errorSyntaxTechnicalName1 && (
                    <FormFeedback>
                      It should contains only lowercase and alpha-numeric
                      characters.
                    </FormFeedback>
                  )}
                </Col>{" "}
                -
                <Col>
                  <Input
                    type="text"
                    name="emai-tn-s"
                    id="emai-tn-s"
                    onChange={this.handleChangeTechnicalName2}
                    onBlur={this.handleChangeTechnicalName2}
                    invalid={
                      this.state.errorRequiredTechnicalName2 ||
                      this.state.errorSyntaxTechnicalName2
                    }
                  />
                  {this.state.errorRequiredTechnicalName2 && (
                    <FormFeedback>This field is required.</FormFeedback>
                  )}
                  {this.state.errorSyntaxTechnicalName2 && (
                    <FormFeedback>
                      It should contains only lowercase and alpha-numeric
                      characters.
                    </FormFeedback>
                  )}
                </Col>{" "}
                -
                <Col>
                  <Input
                    type="number"
                    name="emai-tn-v"
                    min="1"
                    onChange={this.handleChangeTechnicalName3}
                    onBlur={this.handleChangeTechnicalName3}
                  />
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

            {this.props.publicDomain && (
              <FormGroup>
                <Label for="emai-preview">
                  URL preview of the instance web access point
                </Label>

                <InputGroup>
                  <InputGroupAddon addonType="append">
                    <Button
                      color="secondary"
                      className="emai-preview-icon"
                      onClick={function() {}}
                    >
                      <i className="fa fa-globe" />
                    </Button>
                    <UncontrolledTooltip
                      placement="bottom"
                      target=".emai-preview-icon"
                    >
                      This public URL will be the one to use to access your
                      instance. Create the instance and try the URL.
                    </UncontrolledTooltip>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    id="emai-preview"
                    readOnly
                    placeholder="Generated URL…"
                    value={
                      "http://" +
                      this.state.technicalName +
                      "." +
                      this.props.publicDomain
                    }
                  />
                </InputGroup>
              </FormGroup>
            )}
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
