import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Row, Col } from "reactstrap";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

import windowsDrive from "./ModalWebdav-windows-drive.png";
import ubuntuDrive from "./ModalWebdav-ubuntu-drive.png";
import "./ModalWebdav.css";

class ModalWebdav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "tab-windows"
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    let webdavURLWin, webdavURLUbu;
    if (this.props.config.publicDomain) {
      webdavURLWin =
        this.props.config.publicProtocol +
        "://webdav." +
        this.props.config.publicDomain +
        "/" +
        this.props.instance.technicalName +
        "/data/";
      webdavURLUbu =
        "dav://webdav." + // maybe it will not work when https is enabled (this.props.config.publicProtocol)
        this.props.config.publicDomain +
        "/" +
        this.props.instance.technicalName +
        "/data/";
    } else {
      webdavURLWin =
        "http://" +
        window.location.hostname +
        ":35270/" +
        this.props.instance.technicalName +
        "/data/";
      webdavURLUbu =
        "dav://" +
        window.location.hostname +
        ":35270/" +
        this.props.instance.technicalName +
        "/data/";
    }

    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-modal-webdav"
      >
        <ModalHeader toggle={this.props.toggle}>
          Setup the <code>{this.props.instance.technicalName}</code> webdav
          network share
        </ModalHeader>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "tab-windows"
                })}
                onClick={() => {
                  this.toggleTab("tab-windows");
                }}
              >
                Windows desktop
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "tab-ubuntu"
                })}
                onClick={() => {
                  this.toggleTab("tab-ubuntu");
                }}
              >
                Ubuntu desktop
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="tab-windows">
              <Row>
                <Col>
                  <p>
                    Here are the steps to connect the Webdav network drive of{" "}
                    <code>{this.props.instance.technicalName}</code> on your
                    local windows desktop.
                  </p>
                  <ListGroup>
                    <ListGroupItem>
                      1. Create a new network drive: right click on your file
                      explorer.
                    </ListGroupItem>
                    <ListGroupItem>
                      2. As shown on the screenshot on the right, copy paste the
                      folowing webdav URL into the "Dossier" field.
                      <br />
                      <code>{webdavURLWin}</code>
                    </ListGroupItem>
                    <ListGroupItem>
                      3. Click on "Terminer", enter the ezmaster login/password
                      and enjoy, and enjoy: you will be able to add/remove files
                    </ListGroupItem>
                  </ListGroup>
                </Col>
                <Col>
                  <img src={windowsDrive} width="500px" alt="" />
                </Col>
              </Row>
            </TabPane>

            <TabPane tabId="tab-ubuntu">
              <Row>
                <Col>
                  <p>
                    Here are the steps to connect the Webdav network drive of{" "}
                    <code>{this.props.instance.technicalName}</code> on your
                    local ubuntu desktop.
                  </p>
                  <ListGroup>
                    <ListGroupItem>1. Open your file explorer</ListGroupItem>
                    <ListGroupItem>
                      2. Type CTRL+L and enter this URL in the input field (see
                      the screenshot)
                      <br />
                      <code>{webdavURLUbu}</code>
                    </ListGroupItem>
                    <ListGroupItem>
                      3. Validate with the enter key, enter the ezmaster
                      login/password, and enjoy: you will be able to add/remove
                      files
                    </ListGroupItem>
                  </ListGroup>
                </Col>
                <Col>
                  <img src={ubuntuDrive} width="500px" alt="" />
                </Col>
              </Row>
            </TabPane>
          </TabContent>
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
