import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <Button id="Popover1" onClick={this.toggle}>
            Launch Popover
          </Button>
          <Popover
            placement="bottom"
            isOpen={this.state.popoverOpen}
            target="Popover1"
            toggle={this.toggle}
          >
            <PopoverHeader>Popover Title</PopoverHeader>
            <PopoverBody>
              Sed posuere consectetur est at lobortis. Aenean eu leo quam.
              Pellentesque ornare sem lacinia quam venenatis vestibulum.
            </PopoverBody>
          </Popover>
        </div>
        <div>
          {/* to test font-awesome with reactjs */}
          <i className="fa fa-user fa-4x" />
          &nbsp;
          <i className="fa fa-github-square fa-4x" />
        </div>
      </div>
    );
  }
}

export default App;
