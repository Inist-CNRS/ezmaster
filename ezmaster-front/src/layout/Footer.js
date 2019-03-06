import React, { Component } from "react";
import { UncontrolledTooltip } from "reactstrap";
import "./Footer.css";

class Footer extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  render() {
    return (
      <footer>
        <hr />
        <div className="ezmaster-footer-text float-left ml-2">
          <a href="https://github.com/Inist-CNRS/ezmaster">EzMaster</a>{" "}
          <span>version 5.2.4</span>
        </div>
        <div className="ezmaster-footer-icon float-right mr-2">
          <a href="https://github.com/Inist-CNRS/ezmaster" className="mr-2">
            <i className="fa fa-github" />
          </a>
          <UncontrolledTooltip placement="top" target=".fa-github">
            EzMaster source code hosted on Github
          </UncontrolledTooltip>

          <a
            href="https://trello.com/b/GCu64gDf/ezmaster-suivi-du-projet"
            className="mr-2"
          >
            <i className="fa fa-trello" />
          </a>
          <UncontrolledTooltip placement="top" target=".fa-trello">
            EzMaster developement tasks on Trello
          </UncontrolledTooltip>

          <a href="https://twitter.com/inist_ezmaster">
            <i className="fa fa-twitter" />
          </a>
          <UncontrolledTooltip placement="top" target=".fa-twitter">
            Follow EzMaster on Twitter
          </UncontrolledTooltip>
        </div>
      </footer>
    );
  }
}

export default Footer;
