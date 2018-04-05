import React, { Component } from "react";
import { Jumbotron } from "reactstrap";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { Badge } from "reactstrap";
import {
  Card,
  CardHeader,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardDeck,
  CardSubtitle,
  CardBody
} from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";

import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 10
    };
  }

  componentDidMount() {
    const self = this;
    setInterval(function() {
      self.setState({ percent: Math.random() * 100 });
    }, 1000);
  }

  render() {
    return (
      <Container className="ezmaster-home">
        <Row>
          <Col>
            <h1
              className="display-4"
              dangerouslySetInnerHTML={{
                __html: this.props.config.EZMASTER_HOME_TITLE || "EzMaster"
              }}
            />
            <p
              className="lead"
              dangerouslySetInnerHTML={{
                __html:
                  this.props.config.EZMASER_HOME_DESCRIPTION ||
                  'EzMaster is a none technical backoffice tool for none IT administrators. It aims to manage applications and instances. One instance of an application is a docker packaged software having it\'s own config and it\'s own data. Each instances are isolated and independant, they can be stopped <i class="fa fa-stop-circle"></i> or started <i class="fa fa-play-circle"></i> easily on demand. Applications are "ezmasterized" docker images, they can be easiely downloaded <i class="fa fa-download"></i> from dockerhub.'
              }}
            />
          </Col>
        </Row>
        <Row>&nbsp;</Row>
        <Row>
          <Col>
            <CardDeck>
              <Card>
                <CardHeader>EzMaster resources</CardHeader>
                <CardBody>
                  <CardText className="small">
                    Here is a quick overview of the EzMaster resources currently
                    installed on this server. Click on the{" "}
                    <i className="fa fa-th-list" /> buttons to manage it.
                  </CardText>
                  <hr />
                  <Row>
                    <Col xs="10">
                      <CardText>
                        <Badge color="secondary" pill>
                          12
                        </Badge>{" "}
                        Hosted instances<br />
                        <i className="fa fa-circle ehi-success" />
                        <i className="fa fa-circle ehi-success" />
                        <i className="fa fa-circle ehi-success" />
                        <i className="fa fa-circle ehi-success" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                        <i className="fa fa-circle ehi-stopped" />
                      </CardText>
                    </Col>
                    <Col xs="2">
                      <LinkContainer to="/instances/">
                        <Button color="link">
                          <i className="fa fa-th-list eh-link" />
                        </Button>
                      </LinkContainer>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col xs="10">
                      <CardText>
                        <Badge color="secondary" pill>
                          15
                        </Badge>{" "}
                        Downloaded applications<br />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                        <i className="fa fa-circle eha-pill" />
                      </CardText>
                    </Col>
                    <Col xs="2">
                      <LinkContainer to="/applications/">
                        <Button color="link">
                          <i className="fa fa-th-list eh-link" />
                        </Button>
                      </LinkContainer>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>Server resources</CardHeader>
                <CardBody>
                  <CardText className="small">
                    Empty bars means lot of free resources. Filled bars means
                    there is no more available resources on this server.
                  </CardText>

                  <CardText>
                    Load average{" "}
                    <Progress animated color="success" value="25" />
                  </CardText>
                  <CardText>
                    Memory <Progress animated color="success" value="45" />
                  </CardText>
                  <CardText>
                    Hard disk (data)<Progress
                      animated
                      color="warning"
                      value="85"
                    />
                  </CardText>
                  <CardText>
                    Hard disk (docker)<Progress
                      animated
                      color="success"
                      value="55"
                    />
                  </CardText>
                </CardBody>
              </Card>
            </CardDeck>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
