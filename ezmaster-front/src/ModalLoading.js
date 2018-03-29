import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Row, Col } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Badge } from "reactstrap";

import "./ModalLoading.css";

class ModalLoading extends Component {
  static defaultProps = {
    modalIsOpen: false
  };

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: this.props.modalIsOpen,
      dataLoadingCompleted: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    let self = this;

    // do not close the modal just after the data loading is completed
    // wait 1 second so that the user is happy to see data are loaded
    if (
      !this.modalCloseTimeout &&
      !this.props.config.ajaxLoading &&
      !this.props.instances.ajaxLoading
    ) {
      this.setState({ dataLoadingCompleted: true });
      this.modalCloseTimeout = setTimeout(function() {
        self.setState({ modalIsOpen: false });
      }, 1000);
    }

    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        toggle={this.toggle}
        className="ezmaster-ml"
      >
        <ModalHeader toggle={this.toggle}>Loading EzMaster's data</ModalHeader>

        <ModalBody>
          <Row>
            <Col>
              <p>
                EzMaster need to load initial data from the server before
                displaying any web interface. Please wait few seconds.
              </p>
              <ListGroup className="ezmaster-ml-data">
                <ListGroupItem>
                  <Badge pill className="ezmaster-ml-data1">
                    <i
                      className={
                        "fa " +
                        (this.props.config.ajaxLoading
                          ? "fa-spinner"
                          : "fa-check")
                      }
                    />
                  </Badge>
                  &nbsp;&nbsp;Loading EzMaster configuration
                </ListGroupItem>
                <ListGroupItem>
                  <Badge pill className="ezmaster-ml-data2">
                    <i
                      className={
                        "fa " +
                        (this.props.instances.ajaxLoading
                          ? "fa-spinner"
                          : "fa-check")
                      }
                    />
                  </Badge>
                  &nbsp;&nbsp;Loading EzMaster instances
                </ListGroupItem>
                <ListGroupItem>
                  <Badge pill className="ezmaster-ml-data3">
                    <i
                      className={
                        "fa " + (this.state.data3 ? "fa-check" : "fa-spinner")
                      }
                    />
                  </Badge>
                  &nbsp;&nbsp;Loading EzMaster applications
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {!this.state.dataLoadingCompleted && (
            <div className="bouncing-loader">
              <div />
              <div />
              <div />
            </div>
          )}
          {this.state.dataLoadingCompleted && (
            <div className="text-center">
              <i className="fa fa-thumbs-up" />
              &nbsp;&nbsp;&nbsp;EzMaster is ready&nbsp;&nbsp;&nbsp;
              <i className="fa fa-thumbs-up" />
            </div>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalLoading;
