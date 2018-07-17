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
import latinize from "latinize";
import { toast } from "react-toastify";

import "./ModalAddInstance.css";

class ModalAddInstance extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };
  constructor(props) {
    super(props);

    this.state = {
      application: "",
      longName: "",
      technicalName1: "",
      technicalName1Auto: "",
      technicalName2: "",
      technicalName2Auto: "",
      technicalName3: "",
      technicalName: "___-___",
      formSteps: [],
      errorsList: [
        "errorRequiredLongName",
        "errorRequiredApplication",
        "errorRequiredTechnicalName1",
        "errorSyntaxTechnicalName1",
        "errorRequiredTechnicalName2",
        "errorSyntaxTechnicalName2",
        "errorExistsTechnicalName"
      ],
      errorRequiredLongName: false,
      errorRequiredApplication: false,
      errorRequiredTechnicalName1: false,
      errorSyntaxTechnicalName1: false,
      errorRequiredTechnicalName2: false,
      errorSyntaxTechnicalName2: false,
      errorExistsTechnicalName: false,
      creatingInstance: false
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
    this.generateTechnicalName = this.generateTechnicalName.bind(this);
    this.doCreateInstance = this.doCreateInstance.bind(this);
  }

  doCreateInstance() {
    const self = this;

    self.setState({
      creatingInstance: true
    });

    // async instance creation
    self.props.instances.createInstance(
      {
        application: self.state.application,
        longName: self.state.longName,
        technicalName: self.state.technicalName
      },
      function(err, body) {
        if (err) {
          toast.error(
            <div>
              Instance creation error: <br />
              {err}
              <br />
              {body}
            </div>
          );
        } else {
          toast.success(
            <div>
              <i className="fa fa-plus-circle" /> Instance{" "}
              <strong>{self.state.technicalName}</strong> has been created
            </div>
          );
        }
        // hide the modal
        self.props.toggle();
        self.setState({
          creatingInstance: false
        });
      }
    );
  }

  handleChangeLongName(e) {
    const self = this;
    self.generateTechnicalName(
      {
        ...self.state,
        ...{
          errorRequiredLongName: e.target.value === "",
          longName: e.target.value,
          errorRequiredApplication: this.state.application === ""
        }
      },
      (err, newState) => {
        newState.formSteps = [
          ...new Set(newState.formSteps.concat("longName"))
        ];
        if (newState.technicalName1Auto !== "") {
          newState.formSteps = [
            ...new Set(newState.formSteps.concat("technicalName1"))
          ];
        }
        if (newState.technicalName2Auto !== "") {
          newState.formSteps = [
            ...new Set(newState.formSteps.concat("technicalName2"))
          ];
        }
        self.setState(newState);
      }
    );
  }

  handleChangeApplication(e) {
    this.setState({
      formSteps: [...new Set(this.state.formSteps.concat("application"))],
      errorRequiredApplication: e.target.value === "",
      application: e.target.value
    });
  }

  handleChangeTechnicalName1(e) {
    const self = this;
    e.target.value = this.normalizeTNString(e.target.value);
    let newState = {
      formSteps: [...new Set(this.state.formSteps.concat("technicalName1"))],
      errorRequiredTechnicalName1:
        e.target.value === "" && !this.state.technicalName1Auto,
      errorSyntaxTechnicalName1: !RegExp("^[a-z0-9]*$", "g").test(
        e.target.value
      ),
      errorRequiredApplication: this.state.application === "",
      technicalName1: e.target.value
    };
    this.generateTechnicalName(
      { ...this.state, ...newState },
      (err, newState) => {
        self.setState(newState);
      }
    );
  }
  handleChangeTechnicalName2(e) {
    const self = this;

    e.target.value = this.normalizeTNString(e.target.value);
    let newState = {
      formSteps: [...new Set(this.state.formSteps.concat("technicalName2"))],
      errorRequiredTechnicalName2:
        e.target.value === "" && !this.state.technicalName2Auto,
      errorSyntaxTechnicalName2: !RegExp("^[a-z0-9]*$", "g").test(
        e.target.value
      ),
      errorRequiredApplication: this.state.application === "",
      technicalName2: e.target.value
    };
    self.generateTechnicalName(
      { ...self.state, ...newState },
      (err, newState) => {
        self.setState(newState);
      }
    );
  }
  handleChangeTechnicalName3(e) {
    const self = this;
    let newState = {};
    newState.technicalName3 = e.target.value;
    self.generateTechnicalName(
      { ...self.state, ...newState },
      (err, newState) => {
        self.setState(newState);
      }
    );
  }

  generateTechnicalName(oldState, cb) {
    const self = this;
    let longNameArray = oldState.longName ? oldState.longName.split(" ") : [];
    let newState = {
      ...oldState,
      technicalName1Auto: self.normalizeTNString(
        !oldState.technicalName1
          ? longNameArray[0] ? longNameArray[0] : ""
          : ""
      ),
      technicalName2Auto: self.normalizeTNString(
        !oldState.technicalName2
          ? longNameArray[1] ? longNameArray[1] : ""
          : ""
      )
    };
    newState.technicalName =
      (newState.technicalName1 || newState.technicalName1Auto) +
      "-" +
      (newState.technicalName2 || newState.technicalName2Auto) +
      (newState.technicalName3 ? "-" + newState.technicalName3 : "");

    self.props.instances.CheckInstanceAlreadyExists(
      newState.technicalName,
      (err, notExistsTechnicalName) => {
        newState.errorExistsTechnicalName = !notExistsTechnicalName;
        return cb(err, newState);
      }
    );
  }

  /**
   * used to change a string to a valid technicalName subset
   */
  normalizeTNString(str) {
    return latinize(str)
      .toLowerCase()
      .replace(RegExp("[^a-z0-9]", "g"), "")
      .substring(0, 30);
  }

  render() {
    // calculate if the create button could be enabled
    const nbErrors = this.state.errorsList
      .map(elt => (this.state[elt] ? 1 : 0))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
    const createBtnDisabled =
      this.state.creatingInstance ||
      this.state.formSteps.length < 4 ||
      nbErrors > 0;
    const cancelBtnDisabled = this.state.creatingInstance;

    let applicationsJsx = [];
    this.props.applications.d.forEach(appItem => {
      applicationsJsx.push(
        <option value={appItem.imageName} key={appItem.imageName}>
          {appItem.imageName}
        </option>
      );
    });

    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-add-instance"
      >
        <Form onSubmit={e => e.preventDefault()}>
          <ModalHeader toggle={this.props.toggle}>
            Add a new EzMaster instance
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="emai-application">Application</Label>
              <InputGroup>
                <Input
                  type="select"
                  name="emai-application"
                  id="emai-application"
                  value={this.state.application}
                  onChange={this.handleChangeApplication}
                  onBlur={this.handleChangeApplication}
                  invalid={this.state.errorRequiredApplication}
                >
                  <option value="">select an application…</option>
                  {applicationsJsx}
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
                value={this.state.longName}
                invalid={this.state.errorRequiredLongName}
                onChange={this.handleChangeLongName}
                onBlur={this.handleChangeLongName}
                maxLength={250}
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
                    maxLength={30}
                    value={
                      this.state.technicalName1 || this.state.technicalName1Auto
                    }
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
                    maxLength={30}
                    value={
                      this.state.technicalName2 || this.state.technicalName2Auto
                    }
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
              {this.state.errorExistsTechnicalName && (
                <FormText color="danger">
                  Technical name "{this.state.technicalName}" already exists,
                  please choose another one.
                </FormText>
              )}
              <FormText>
                The technical name is used to identify the instance and to
                access the instance on the web. The first part could be a
                project, the second a study, and the last must be a positive
                number or could be empty.
              </FormText>
            </FormGroup>

            {this.props.config.d.publicDomain && (
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
                      this.props.config.d.publicDomain
                    }
                  />
                </InputGroup>
              </FormGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <FormText
              style={{
                display: this.state.creatingInstance ? "block" : "none"
              }}
            >
              Creating instance.<br /> Please wait ...
            </FormText>
            <Button
              color="secondary"
              onClick={this.props.toggle}
              disabled={cancelBtnDisabled}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              className="emai-create-btn"
              disabled={createBtnDisabled}
              onClick={this.doCreateInstance}
            >
              Create
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default ModalAddInstance;
