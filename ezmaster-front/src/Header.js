import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";

import "./Header.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import logoImage from "./logo.svg";

import InfoMachine from "./InfoMachine.js";

import { Badge } from "reactstrap";

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
          <NavbarBrand href="/">
            <img src={logoImage} alt="EzMaster" height="40px" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleBurger} />
          <Collapse isOpen={this.state.burgerIsOpen} navbar>
            <Nav navbar>
              <NavItem active={true}>
                <LinkContainer to="/instances/">
                  <NavLink
                    active={true}
                    href="/instances/"
                    className="ezmaster-menu"
                  >
                    Instances
                  </NavLink>
                </LinkContainer>
              </NavItem>
              <NavItem>
                <LinkContainer to="/applications/">
                  <NavLink className="ezmaster-menu" href="/applications/">
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
