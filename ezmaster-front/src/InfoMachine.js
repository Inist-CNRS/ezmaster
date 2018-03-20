import React, { Component } from "react";
import "./InfoMachine.css";
import { Nav, NavItem } from "reactstrap";

import { Badge } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import prettyBytes from "pretty-bytes";

class InfoMachine extends Component {
  static defaultProps = {
    nbCpu: 4,
    totalRAM: 2 * 1024 * 1024 * 1024,
    freeRAM: Math.random() * 2 * 1024 * 1024 * 1024,
    dangerLimitRAM: 80,
    totalDataHDD: 20 * 1024 * 1024 * 1024,
    freeDataHDD: Math.random() * 20 * 1024 * 1024 * 1024,
    dangerLimitDataHDD: 80,
    totalDockerHDD: 20 * 1024 * 1024 * 1024,
    freeDockerHDD: Math.random() * 20 * 1024 * 1024 * 1024,
    dangerLimitDockerHDD: 80
  };

  constructor(props) {
    super(props);

    this.state = {
      loadaverage: [
        (Math.random() * this.props.nbCpu * 2).toFixed(1),
        (Math.random() * this.props.nbCpu * 2).toFixed(1),
        (Math.random() * this.props.nbCpu * 2).toFixed(1)
      ],
      ram: Math.round(this.props.freeRAM / this.props.totalRAM * 100),
      dataHDD: Math.round(
        this.props.freeDataHDD / this.props.totalDataHDD * 100
      ),
      dockerHDD: Math.round(
        this.props.freeDockerHDD / this.props.totalDockerHDD * 100
      )
    };
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
            Load average ({this.props.nbCpu} CPUs)
          </UncontrolledTooltip>

          {/* LOAD AVERAGE: 1m */}
          <Badge
            className="mr-2"
            color={
              this.state.loadaverage[0] > this.props.nbCpu
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
              this.state.loadaverage[1] > this.props.nbCpu
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
              this.state.loadaverage[2] > this.props.nbCpu
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
              this.state.ram > this.props.dangerLimitRAM
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-ram-usage"
          >
            {this.state.ram} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-ram-usage"
          >
            <div>Total: {prettyBytes(this.props.totalRAM)}</div>
            <div>Free: {prettyBytes(this.props.freeRAM)}</div>
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
              this.state.dataHDD > this.props.dangerLimitDataHDD
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-hdd-data-usage"
          >
            {this.state.dataHDD} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-data-usage"
          >
            <div>Total: {prettyBytes(this.props.totalDataHDD)}</div>
            <div>Free: {prettyBytes(this.props.freeDataHDD)}</div>
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
              this.state.dockerHDD > this.props.dangerLimitDockerHDD
                ? "danger"
                : "secondary"
            }
            id="ezmaster-im-hdd-docker-usage"
          >
            {this.state.dockerHDD} %
          </Badge>
          <UncontrolledTooltip
            placement="bottom"
            autohide={false}
            target="ezmaster-im-hdd-docker-usage"
          >
            <div>Total: {prettyBytes(this.props.totalDockerHDD)}</div>
            <div>Free: {prettyBytes(this.props.freeDockerHDD)}</div>
          </UncontrolledTooltip>
        </NavItem>
      </Nav>
    );
  }
}

export default InfoMachine;
