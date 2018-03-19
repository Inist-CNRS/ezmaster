import React, { Component } from "react";
import "./InfoMachine.css";
import { Nav, NavItem } from "reactstrap";

import { Badge } from "reactstrap";

class InfoMachine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadaverage: [
        (Math.random() * 8).toFixed(1),
        (Math.random() * 8).toFixed(1),
        (Math.random() * 8).toFixed(1)
      ],
      ram: Math.round(Math.random() * 100),
      hdd: Math.round(Math.random() * 100)
    };
  }

  render() {
    return (
      <Nav className={this.props.className} navbar>
        <NavItem>
          <i className="mr-2 align-middle fa fa-server" />
          <Badge className="mr-2" color="secondary">
            {this.state.loadaverage[0]}
          </Badge>
          <Badge className="mr-2" color="secondary">
            {this.state.loadaverage[1]}
          </Badge>
          <Badge className="mr-2" color="secondary">
            {this.state.loadaverage[2]}
          </Badge>
        </NavItem>
        <NavItem>
          <i className="ml-2 mr-2 align-middle fa fa-microchip" />
          <Badge className="mr-2" color="secondary">
            {this.state.ram} %
          </Badge>
        </NavItem>
        <NavItem>
          <i className="ml-2 mr-2 align-middle fa fa-save" />
          <Badge className="mr-2" color="secondary">
            {this.state.hdd} %
          </Badge>
        </NavItem>
      </Nav>
    );
  }
}

export default InfoMachine;
