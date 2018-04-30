import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import { Button } from "reactstrap";

import "./Header.css";
import logoImage from "./ezmaster-logo-header.png";
import InfoMachine from "./InfoMachine.js";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      burgerIsOpen: false
    };
    this.toggleBurger = this.toggleBurger.bind(this);
  }
  toggleBurger() {
    this.setState({
      burgerIsOpen: !this.state.burgerIsOpen
    });
  }

  render() {
    return (
      <header>
        <Navbar color="faded" light expand="md">
          <LinkContainer to="/">
            <NavbarBrand href="/">
              <img src={logoImage} className="ezmaster-logo-header" alt="EzMaster" height="55px" />
            </NavbarBrand>
          </LinkContainer>
          <NavbarToggler onClick={this.toggleBurger} />
          <Collapse isOpen={this.state.burgerIsOpen} navbar>
            <Nav navbar>
              <NavItem active={this.props.instancesActive}>
                <LinkContainer to="/instances/">
                  <NavLink
                    active={this.props.instancesActive}
                    href="/instances/"
                    className="ezmaster-menu"
                  >
                    Instances
                  </NavLink>
                </LinkContainer>
              </NavItem>
              <NavItem active={this.props.applicationsActive}>
                <LinkContainer to="/applications/">
                  <NavLink
                    active={this.props.applicationsActive}
                    className="ezmaster-menu"
                    href="/applications/"
                  >
                    Applications
                  </NavLink>
                </LinkContainer>
              </NavItem>
            </Nav>

            <InfoMachine className="ml-auto" />
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default Header;
