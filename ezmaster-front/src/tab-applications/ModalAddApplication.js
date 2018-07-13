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

import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";

import { Row, Col } from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UncontrolledTooltip } from "reactstrap";

import latinize from "latinize";
import { toast } from "react-toastify";

import ezmasterizedLogo from "./ezmasterized-logo.png";

import "./ModalAddApplication.css";

class ModalAddApplication extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };
  constructor(props) {
    super(props);
    this.state = {
      applicationName: "",
      applicationVersion: "",

      // will be dynamicaly filled by dockerhub api suggestions
      applicationsNameList: [],
      applicationsVersionList: [],
      applicationsNameListLoading: false,
      applicationsVersionListLoading: false,

      dockerRegistryUrl: "",
      username: "",
      password: "",
      email: "",

      errorRequiredApplicationName: false,
      errorRequiredApplicationVersion: false,
      creatingApplication: false
    };

    this.handleChangeApplicationName = this.handleChangeApplicationName.bind(
      this
    );
    this.handleChangeApplicationVersion = this.handleChangeApplicationVersion.bind(
      this
    );
    this.doCreateApplication = this.doCreateApplication.bind(this);
    this.loadApplicationNameSuggestion = this.loadApplicationNameSuggestion.bind(
      this
    );
    this.handleApplicationNameSelected = this.handleApplicationNameSelected.bind(
      this
    );
  }

  doCreateApplication() {
    const self = this;

    self.setState({
      creatingApplication: true
    });

    // async application creation
    self.props.applications.createApplication(
      {
        imageName: self.state.applicationName,
        versionImage: self.state.applicationVersion,
        imageHub: self.state.dockerRegistryUrl,
        username: self.state.username,
        password: self.state.password,
        email: self.state.email
      },
      function(err, body) {
        if (err) {
          toast.error(
            <div>
              Application creation error: <br />
              {err}
              <br />
              {body}
            </div>
          );
        } else {
          toast.success(
            <div>
              Application{" "}
              <strong>
                {self.state.applicationName}:{self.state.applicationVersion}
              </strong>{" "}
              has been created <i className="fa fa-plus-circle" />
            </div>
          );
        }
        // hide the modal
        self.props.toggle();
        self.setState({
          creatingApplication: false
        });
      }
    );
  }

  /**
   * When the application name input filed is modified
   * ex: one caracter is typed
   */
  handleChangeApplicationName(e) {
    const self = this;
    const inputValue =
      e && e.target ? e.target.value : self.state.applicationName;
    console.log("handleChangeApplicationName", inputValue);
    self.setState({
      errorRequiredApplicationName: inputValue.trim().length == 0
    });

    // skip if the value is not changed !
    if (inputValue == self.state.applicationName) return;

    self.setState({
      applicationName: inputValue
    });

    // wait 10 ms if no other key is typed then request dockerhub
    if (self.applicationNameTimer) {
      clearTimeout(self.applicationNameTimer);
    }
    self.applicationNameTimer = setTimeout(() => {
      self.setState({ applicationsNameListLoading: true });
      self.loadApplicationNameSuggestion(inputValue, applicationsNameList => {
        applicationsNameList = applicationsNameList.map(item => {
          // search if this app is in the ezmasterized list
          // then extract the description and set the flag ezmasterized=true
          // (docker image name is the string to compare)
          let ezmasterized = false;
          let github = "";
          let description = "";
          Object.keys(self.props.ezMasterizedApps.d).forEach(key => {
            if (self.props.ezMasterizedApps.d[key].docker == item.name) {
              ezmasterized =
                self.props.ezMasterizedApps.d[key].docker == item.name;
              description = self.props.ezMasterizedApps.d[key].description;
              github = self.props.ezMasterizedApps.d[key].github;
            }
          });

          return {
            name: item.name,
            description: description ? description : item.description,
            github: github,
            ezmasterized: ezmasterized
          };
        });
        self.setState({
          applicationsNameList,
          applicationsNameListLoading: false
        });
      });
    }, 100);
  }

  /**
   * When clicked on an item in the application name list
   * select it, fill the input thanks to the state
   * and empty the application name list
   */
  handleApplicationNameSelected(applicationName) {
    const self = this;
    self.setState({
      applicationName: applicationName,
      applicationsNameList: [],
      errorRequiredApplicationName: applicationName.length == 0
    });
    self.inputApplicationName.focus();
    self.loadApplicationVersionSuggestionWithTimeout();
  }
  handleApplicationVersionSelected(applicationVersion) {
    const self = this;
    console.log("applicationVersion", applicationVersion);
    self.setState({
      applicationVersion: applicationVersion,
      applicationsVersionList: [],
      errorRequiredApplicationVersion: applicationVersion.length == 0
    });
    self.inputApplicationVersion.focus();
  }

  handleChangeApplicationVersion(e) {
    const self = this;

    // update the input field value
    const inputValue =
      e && e.target ? e.target.value : self.state.applicationVersion;
    console.log("handleChangeApplicationVersion", e, inputValue);
    self.setState({
      errorRequiredApplicationVersion: inputValue.trim().length == 0
    });
    // skip if the value is not changed !
    if (inputValue != self.state.applicationVersion) {
      self.setState({
        applicationVersion: inputValue
      });
      self.loadApplicationVersionSuggestionWithTimeout();
    }
  }

  loadApplicationNameSuggestion(inputValue, callback) {
    if (!inputValue) return callback([]);

    // /-/v1/hub/search/repositories/?query=inist&page=1&page_size=5
    this.props.applications.searchDockerHubImageName(
      inputValue,
      (err, applicationsList) => {
        if (err) return callback([]);
        callback(applicationsList);
      }
    );
  }

  loadApplicationVersionSuggestion(applicationName, callback) {
    if (!applicationName) return callback([]);

    // /-/v1/hub/repositories/inistcnrs/ezmaster-webserver/tags/?page=1&page_size=10
    this.props.applications.searchDockerHubImageVersion(
      applicationName,
      (err, applicationsVersionList) => {
        if (err) return callback([]);
        callback(applicationsVersionList);
      }
    );
  }
  loadApplicationVersionSuggestionWithTimeout() {
    const self = this;

    // do nothing more it the applicationName is empty because
    // searching on dockerhub would be useless
    if (!self.state.applicationName) return;

    // wait 10 ms if no other key is typed then request dockerhub
    if (self.applicationVersionTimer) {
      clearTimeout(self.applicationVersionTimer);
    }
    self.applicationVersionTimer = setTimeout(() => {
      self.setState({ applicationsVersionListLoading: true });
      self.loadApplicationVersionSuggestion(
        self.state.applicationName,
        applicationsVersionList => {
          self.setState({
            applicationsVersionList,
            applicationsVersionListLoading: false
          });
        }
      );
    }, 100);
  }

  render() {
    const self = this;

    // calculate if the create button could be enabled
    const createBtnDisabled =
      this.state.creatingApplication ||
      this.state.applicationName.length == 0 ||
      this.state.applicationVersion.length == 0;
    const cancelBtnDisabled = this.state.creatingApplication;

    let applicationsNameListJSON = this.state.applicationsNameList;
    // if (this.state.applicationName.length == 0) {
    //   applicationsNameListJSON = Object.keys(self.props.ezMasterizedApps.d).map((key) => {
    //     let item = self.props.ezMasterizedApps.d[key];
    //     return {
    //       name: item.docker,
    //       description: item.description,
    //       github: item.github,
    //       ezmasterized: true
    //     }
    //   }).slice(0, 5)
    // }

    // applications name suggestion list
    const applicationsNameList = applicationsNameListJSON.map(item => {
      return (
        <ListGroupItem
          onClick={() => this.handleApplicationNameSelected(item.name)}
        >
          {item.github && (
            <a
              href={"https://github.com/" + item.github}
              target="_blank"
              className="github-link"
              title="Github link"
            >
              <i className="fa fa-github" />
            </a>
          )}
          {item.ezmasterized && (
            <img
              src={ezmasterizedLogo}
              alt="EzMasterized application"
              title="EzMasterized application"
              height="20px"
            />
          )}
          <ListGroupItemHeading>{item.name}</ListGroupItemHeading>
          <ListGroupItemText>{item.description}</ListGroupItemText>
        </ListGroupItem>
      );
    });
    // applications version suggestion list
    const applicationsVersionList = this.state.applicationsVersionList.map(
      item => {
        return (
          <ListGroupItem
            onClick={() => this.handleApplicationVersionSelected(item.name)}
          >
            <ListGroupItemHeading>{item.name}</ListGroupItemHeading>
            {/*          <ListGroupItemText>{item.description}</ListGroupItemText>*/}
          </ListGroupItem>
        );
      }
    );
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-add-application"
      >
        <Form onSubmit={e => e.preventDefault()}>
          <ModalHeader toggle={this.props.toggle}>
            Add a new EzMaster application
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="emaa-name">Application name</Label>

              <InputGroup>
                <Input
                  type="text"
                  name="emaa-name"
                  id="emaa-name"
                  autoComplete="off"
                  placeholder="Ex: inistcnrs/ezmaster-webserver"
                  value={this.state.applicationName}
                  invalid={this.state.errorRequiredApplicationName}
                  onChange={this.handleChangeApplicationName}
                  onBlur={this.handleChangeApplicationName}
                  maxLength={250}
                  innerRef={elt => (this.inputApplicationName = elt)}
                />
                {this.state.applicationsNameListLoading && (
                  <InputGroupAddon addonType="append">
                    <Button color="grey" className="emaa-loading">
                      <i className="fa fa-spinner" />
                    </Button>
                  </InputGroupAddon>
                )}
              </InputGroup>

              <ListGroup className="emaa-name-list">
                {applicationsNameList}
              </ListGroup>

              {this.state.errorRequiredApplicationName && (
                <FormText color="danger">
                  Application name is required.
                </FormText>
              )}
              <FormText>
                Type a part of (autocomplete from dockerhub) or the{" "}
                <a
                  href="https://github.com/Inist-CNRS/ezmaster/blob/master/EZMASTERIZED.md"
                  target="_blank"
                >
                  ezmasterized application
                </a>{" "}
                name (docker image name).
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label for="emaa-version">Application version</Label>
              <ListGroup className="emaa-version-list">
                {applicationsVersionList}
              </ListGroup>

              <InputGroup>
                <Input
                  type="text"
                  name="emaa-version"
                  id="emaa-version"
                  autoComplete="off"
                  placeholder="..."
                  value={this.state.applicationVersion}
                  invalid={this.state.errorRequiredApplicationVersion}
                  onChange={this.handleChangeApplicationVersion}
                  onBlur={this.handleChangeApplicationVersion}
                  maxLength={100}
                  innerRef={elt => (this.inputApplicationVersion = elt)}
                />

                {this.state.applicationsVersionListLoading && (
                  <InputGroupAddon addonType="append">
                    <Button color="grey" className="emaa-loading">
                      <i className="fa fa-spinner" />
                    </Button>
                  </InputGroupAddon>
                )}
              </InputGroup>

              {this.state.errorRequiredApplicationVersion && (
                <FormFeedback>Version is required.</FormFeedback>
              )}
              <FormText>
                Type the application version (docker image tag)
              </FormText>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <FormText
              style={{
                display: this.state.creatingApplication ? "block" : "none"
              }}
            >
              Creating application.<br /> Please wait ...
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
              className="emaa-create-btn"
              disabled={createBtnDisabled}
              onClick={this.doCreateApplication}
            >
              Create
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default ModalAddApplication;
