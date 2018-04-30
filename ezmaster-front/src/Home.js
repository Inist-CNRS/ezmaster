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
    const self = this;

    const instancesPills = [];
    self.props.instances &&
      Object.keys(self.props.instances).forEach(function(technicalName) {
        const instance = self.props.instances[technicalName];
        instancesPills.push(
          <i
            className={
              "fa fa-circle " +
              (instance.running ? "ehi-success" : "ehi-stopped")
            }
            key={"i-pill-" + technicalName}
          />
        );
      });

    const applicationsPills = [];
    self.props.applications &&
      self.props.applications.forEach(function(application, idx) {
        applicationsPills.push(
          <i className="fa fa-circle eha-pill" key={"a-pill-" + idx} />
        );
      });

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
            <div
              className="lead"
              dangerouslySetInnerHTML={{
                __html:
                  this.props.config.EZMASTER_HOME_DESCRIPTION ||
                  'EzMaster is a non-technical docker backoffice tools for non-IT administrators. It aims to manage applications and instances. One instance of an application is a docker packaged software having its own config and its own data. Each instance is isolated and independant, it can be stopped <i class="fa fa-stop-circle"></i> or started <i class="fa fa-play-circle"></i> easily on demand. Applications are "ezmasterized" docker images, they can be easily downloaded <i class="fa fa-download"></i> from dockerhub.'
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
                    <Col xs="8">
                      <CardText>
                        <Badge color="secondary" pill>
                          {instancesPills.length}
                        </Badge>{" "}
                        Hosted instances<br />
                        {instancesPills}
                      </CardText>
                    </Col>
                    <Col className="eh-link">
                      <LinkContainer to="/instances/">
                        <Button color="link">
                          <i className="fa fa-th-list" />
                        </Button>
                      </LinkContainer>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col xs="8">
                      <CardText>
                        <Badge color="secondary" pill>
                          {applicationsPills.length}
                        </Badge>{" "}
                        Downloaded applications<br />
                        {applicationsPills}
                      </CardText>
                    </Col>
                    <Col className="eh-link">
                      <LinkContainer to="/applications/">
                        <Button color="link">
                          <i className="fa fa-th-list" />
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

                  <CardText>Load average</CardText>
                  <Progress animated color="success" value="25" />

                  <CardText>Memory</CardText>
                  <Progress animated color="success" value="45" />

                  <CardText>Hard disk (data)</CardText>
                  <Progress animated color="warning" value="85" />

                  <CardText>Hard disk (docker)</CardText>
                  <Progress
                    animated
                    color="success"
                    value={this.state.percent}
                  />
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
