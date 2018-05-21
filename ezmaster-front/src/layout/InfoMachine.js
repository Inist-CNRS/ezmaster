import React, { Component } from "react";
import "./InfoMachine.css";
import { Nav, NavItem } from "reactstrap";

import { Badge } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { prettyBytes } from "../helpers.js";

class InfoMachine extends Component {
  static defaultProps = {
    className: ""
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Nav className={this.props.className + " ezmaster-im"} navbar>
        <NavItem className="ml-3">
          {/* LOAD AVERAGE */}
          <i
            className="mr-2 align-middle fa fa-server"
            id="ezmaster-im-loadaverage"
          />
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-loadaverage"
          >
            Load average ({this.props.infoMachine.d.nbCPUs} CPUs)
          </UncontrolledTooltip>

          {/* LOAD AVERAGE: 1m */}
          <Badge
            className="mr-2"
            color={
              this.props.infoMachine.d.loadAverage[0] >
              this.props.infoMachine.d.nbCPUs
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-loadaverage-1m"
          >
            {this.props.infoMachine.d.loadAverage[0]}
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-loadaverage-1m"
          >
            Load average over 1 minute
          </UncontrolledTooltip>

          {/* LOAD AVERAGE: 5m */}
          <Badge
            className="mr-2"
            color={
              this.props.infoMachine.d.loadAverage[1] >
              this.props.infoMachine.d.nbCPUs
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-loadaverage-5m"
          >
            {this.props.infoMachine.d.loadAverage[1]}
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-loadaverage-5m"
          >
            Load average over 5 minutes
          </UncontrolledTooltip>

          {/* LOAD AVERAGE: 15m */}
          <Badge
            className="mr-2"
            color={
              this.props.infoMachine.d.loadAverage[2] >
              this.props.infoMachine.d.nbCPUs
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-loadaverage-15m"
          >
            {this.props.infoMachine.d.loadAverage[2]}
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-loadaverage-15m"
          >
            Load average over 15 minutes
          </UncontrolledTooltip>
        </NavItem>
        <NavItem className="ml-3">
          {/* RAM */}
          <i
            className="mr-2 align-middle fa fa-microchip"
            id="ezmaster-im-ram"
          />
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-ram"
          >
            RAM usage
          </UncontrolledTooltip>

          <Badge
            className="mr-2"
            color={
              this.props.infoMachine.d.useMemoryPercentage >
              this.props.config.d.fullMemoryPercent
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-ram-usage"
          >
            {this.props.infoMachine.d.useMemoryPercentage} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-ram-usage"
          >
            <div>Total: {this.props.infoMachine.d.totalMemory}</div>
            <div>Free: {this.props.infoMachine.d.freeMemory}</div>
          </UncontrolledTooltip>
        </NavItem>

        {/* DATA HDD */}
        <NavItem className="ml-3">
          <i
            className="mr-2 align-middle fa fa-database"
            id="ezmaster-im-hdd-data"
          />
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-data"
          >
            Data HDD usage
          </UncontrolledTooltip>
          <Badge
            className="mr-2"
            color={
              this.props.infoMachine.d.diskApp.useDiskPercentage >
              this.props.config.d.fullFsPercent
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-hdd-data-usage"
          >
            {this.props.infoMachine.d.diskApp.useDiskPercentage} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-data-usage"
          >
            <div>
              Total:{" "}
              {prettyBytes(this.props.infoMachine.d.diskApp.totalDiskRaw)}
            </div>
            <div>
              Free: {prettyBytes(this.props.infoMachine.d.diskApp.freeDiskRaw)}
            </div>
          </UncontrolledTooltip>
        </NavItem>

        {/* DOCKER HDD */}
        <NavItem className="ml-3">
          <i
            className="mr-2 align-middle fa fa-database"
            id="ezmaster-im-hdd-docker"
          />
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-docker"
          >
            Docker HDD usage
          </UncontrolledTooltip>
          <Badge
            className="mr-2"
            color={
              this.props.infoMachine.d.diskDocker.useDiskPercentage >
              this.props.config.d.fullFsPercent
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-hdd-docker-usage"
          >
            {this.props.infoMachine.d.diskDocker.useDiskPercentage} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-docker-usage"
          >
            <div>
              Total:{" "}
              {prettyBytes(this.props.infoMachine.d.diskDocker.totalDiskRaw)}
            </div>
            <div>
              Free:{" "}
              {prettyBytes(this.props.infoMachine.d.diskDocker.freeDiskRaw)}
            </div>
          </UncontrolledTooltip>
        </NavItem>
      </Nav>
    );
  }
}

export default InfoMachine;
