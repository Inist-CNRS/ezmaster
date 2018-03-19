import React, { Component } from "react";
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
                <NavLink active={true} href="/instances/">
                  Instances
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/applications/">Applications</NavLink>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              <NavItem>cpu</NavItem>
              <NavItem>mem</NavItem>
              <NavItem>disk</NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default Header;
