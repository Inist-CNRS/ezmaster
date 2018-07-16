import React, { Component } from "react";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { Badge } from "reactstrap";
import {
  Card,
  CardHeader,
  Button,
  CardText,
  CardDeck,
  CardBody
} from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";

import "./Home.css";

class Home extends Component {
  render() {
    const self = this;

    const instancesPills = [];
    Object.keys(self.props.instances.d).forEach(function(technicalName) {
      let instance = self.props.instances.d[technicalName];
      instancesPills.push(
        <i
          className={
            "fa fa-circle " + (instance.running ? "ehi-success" : "ehi-stopped")
          }
          key={"i-pill-" + instance.technicalName}
        />
      );
    });

    const applicationsPills = [];
    self.props.applications.d.forEach(function(application, idx) {
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
                __html:
                  (this.props.config.d &&
                    this.props.config.d.EZMASTER_HOME_TITLE) ||
                  "EzMaster"
              }}
            />
            <div
              className="lead"
              dangerouslySetInnerHTML={{
                __html:
                  (this.props.config.d &&
                    this.props.config.d.EZMASTER_HOME_DESCRIPTION) ||
                  'EzMaster is a non-technical docker backoffice tools for non-IT administrators. It aims to manage applications and instances. One instance of an application is a docker packaged software having its own config and its own data. Each instance is a docker container, is isolated and independant, and can be stopped <i class="fa fa-stop-circle"></i> or started <i class="fa fa-play-circle"></i> easily on demand. Applications are "ezmasterized" docker images, they can be easily downloaded <i class="fa fa-download"></i> from dockerhub.'
              }}
            />
          </Col>
        </Row>
        <Row>&nbsp;</Row>
        <Row>
          <Col>
            <CardDeck>
              <Card className="ezmaster-home-card">
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
              <Card className="ezmaster-home-card">
                <CardHeader>Server resources</CardHeader>
                <CardBody>
                  <CardText className="small">
                    Empty bars means lot of free resources. Filled bars means
                    there is no more available resources on this server.
                  </CardText>

                  <CardText>Load average</CardText>
                  <Progress
                    animated
                    color={
                      this.props.infoMachine.d.loadAverage[0] >
                      this.props.infoMachine.d.nbCPUs
                        ? "danger"
                        : "success"
                    }
                    value={
                      this.props.infoMachine.d.loadAverage[0] *
                      80 /
                      this.props.infoMachine.d.nbCPUs
                    }
                  />

                  <CardText>Memory</CardText>
                  <Progress
                    animated
                    color={
                      this.props.infoMachine.d.useMemoryPercentage >
                      this.props.config.d.fullMemoryPercent
                        ? "danger"
                        : "success"
                    }
                    value={this.props.infoMachine.d.useMemoryPercentage}
                  />

                  <CardText>Hard disk (data)</CardText>
                  <Progress
                    animated
                    color={
                      this.props.infoMachine.d.diskApp.fsIsAlmostFilled
                        ? "danger"
                        : "success"
                    }
                    value={this.props.infoMachine.d.diskApp.useDiskPercentage}
                  />

                  <CardText>Hard disk (docker)</CardText>
                  <Progress
                    animated
                    color={
                      this.props.infoMachine.d.diskDocker.fsIsAlmostFilled
                        ? "danger"
                        : "success"
                    }
                    value={
                      this.props.infoMachine.d.diskDocker.useDiskPercentage
                    }
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
