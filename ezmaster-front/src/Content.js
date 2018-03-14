import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

class Content extends Component {

  render() {
    return (
      <Container>
            <Row>
            <Col>
              {/* to test font-awesome with reactjs */}
              <i className="fa fa-user fa-4x" />
              &nbsp;
              <i className="fa fa-github-square fa-4x" />
            </Col>
            </Row>
      </Container>
    );
  }
}

export default Content;
