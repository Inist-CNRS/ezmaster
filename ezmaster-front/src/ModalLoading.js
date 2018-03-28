import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Row, Col } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Badge } from "reactstrap";

import "./ModalLoading.css";

class ModalLoading extends Component {
  static defaultProps = {
    modalIsOpen: false,
    toggle: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      data1: Math.random() > 0.5,
      data2: Math.random() > 0.5,
      data3: Math.random() > 0.5
    };
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggle}
        className="ezmaster-ml"
      >
        <ModalHeader toggle={this.props.toggle}>
          Loading EzMaster's data
        </ModalHeader>

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
                        "fa " + (this.state.data1 ? "fa-check" : "fa-spinner")
                      }
                    />
                  </Badge>
                  &nbsp;&nbsp;Loading EzMaster configuration
                </ListGroupItem>
                <ListGroupItem>
                  <Badge pill className="ezmaster-ml-data2">
                    <i
                      className={
                        "fa " + (this.state.data2 ? "fa-check" : "fa-spinner")
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
          <div className="bouncing-loader">
            <div />
            <div />
            <div />
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalLoading;
