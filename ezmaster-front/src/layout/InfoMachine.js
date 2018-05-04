import React, { Component } from "react";
import "./InfoMachine.css";
import { Nav, NavItem } from "reactstrap";

import { Badge } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { prettyBytes } from "../helpers.js";

import { subscribeToInfoMachines } from "../models/ModelInfoMachine.js";

class InfoMachine extends Component {
  static defaultProps = {
    config: { fullFsPercent: 100, fullMemoryPercent: 80 },
    className: ""
  };

  constructor(props) {
    super(props);

    this.state = {
      nbCPUs: 1,
      loadaverage: ["...", "...", "..."],
      totalMemory: "... GB",
      freeMemory: "... MB",
      useMemoryPercentage: 0,
      diskApp: {
        freeDiskRaw: 0,
        totalDiskRaw: 0,
        freeDisk: "... GB",
        totalDisk: "... GB",
        useDiskPercentage: 0,
        fsIsAlmostFilled: false,
        maxFileCapSize: 0
      },
      diskDocker: {
        freeDiskRaw: 0,
        totalDiskRaw: 0,
        freeDisk: "... GB",
        totalDisk: "... GB",
        useDiskPercentage: 0,
        fsIsAlmostFilled: false,
        maxFileCapSize: 0
      }
    };
  }

  componentDidMount() {
    const self = this;
    subscribeToInfoMachines(function(err, data) {
      self.setState({ ...data });
    });
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
            Load average ({this.state.nbCPUs} CPUs)
          </UncontrolledTooltip>

          {/* LOAD AVERAGE: 1m */}
          <Badge
            className="mr-2"
            color={
              this.state.loadaverage[0] > this.state.nbCPUs
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-loadaverage-1m"
          >
            {this.state.loadaverage[0]}
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
              this.state.loadaverage[1] > this.state.nbCPUs
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-loadaverage-5m"
          >
            {this.state.loadaverage[1]}
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
              this.state.loadaverage[2] > this.state.nbCPUs
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-loadaverage-15m"
          >
            {this.state.loadaverage[2]}
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
              this.state.useMemoryPercentage >
              this.props.config.fullMemoryPercent
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-ram-usage"
          >
            {this.state.useMemoryPercentage} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-ram-usage"
          >
            <div>Total: {this.state.totalMemory}</div>
            <div>Free: {this.state.freeMemory}</div>
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
              this.state.diskApp.useDiskPercentage >
              this.props.config.fullFsPercent
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-hdd-data-usage"
          >
            {this.state.diskApp.useDiskPercentage} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-data-usage"
          >
            <div>Total: {prettyBytes(this.state.diskApp.totalDiskRaw)}</div>
            <div>Free: {prettyBytes(this.state.diskApp.freeDiskRaw)}</div>
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
              this.state.diskDocker.useDiskPercentage >
              this.props.config.fullFsPercent
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-hdd-docker-usage"
          >
            {this.state.diskDocker.useDiskPercentage} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-docker-usage"
          >
            <div>Total: {prettyBytes(this.state.diskDocker.totalDiskRaw)}</div>
            <div>Free: {prettyBytes(this.state.diskDocker.freeDiskRaw)}</div>
          </UncontrolledTooltip>
        </NavItem>
      </Nav>
    );
  }
}

export default InfoMachine;
