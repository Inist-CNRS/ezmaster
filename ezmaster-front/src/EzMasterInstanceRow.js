import React, { Component } from "react";
import { Button } from "reactstrap";
import { Badge } from "reactstrap";
import "./EzMasterInstanceRow.css";

class EzMasterInstanceRow extends Component {
  render() {
    return (
      <tr>
        <td>Les projets du DPI</td>
        <td>
          <a href="#">all-projects-5</a>
        </td>
        <td>2018/03/05 14:46:05</td>
        <td>inistcnrs/lodex:8.18.0</td>
        <td>
          <Badge color="danger">Stopped</Badge>
          <Badge color="success">Running</Badge>
        </td>
        <td>
          <Button color="link" className="ezmaster-a ezmaster-a-stop">
            <i className="fa fa-stop-circle" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-play">
            <i className="fa fa-play-circle" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-trash">
            <i className="fa fa-trash" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-cog">
            <i className="fa fa-cog" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-upload">
            <i className="fa fa-upload" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-link">
            <i className="fa fa-link" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-globe">
            <i className="fa fa-globe" />
          </Button>
          <Button color="link" className="ezmaster-a ezmaster-a-file">
            <i className="fa fa-file" />
          </Button>
        </td>
      </tr>
    );
  }
}

export default EzMasterInstanceRow;
