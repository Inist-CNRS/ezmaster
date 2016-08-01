# ezmaster

[![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster) [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/ezmaster/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/ezmaster)

Administration of docker applications without any IT skills.

## Requirements

    - Git
        https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

    - Docker (Version >= 1.10)
        https://docs.docker.com/engine/installation/

    - Docker-Compose (Version >= 1.7)
        https://docs.docker.com/compose/install/

    - NodeJS
        https://nodejs.org/en/
        OR
        https://nodejs.org/en/download/package-manager/

    - MongoDB
        https://docs.mongodb.com/manual/installation/


#### Environment variables

```shell
# Environment variable the IP ezmaster instances will use to be joinable from outside.
# Default is "127.0.0.1"
export EZMASTER_PUBLIC_IP="Your IP"


# Environment variable the ports ezmaster is allowed to use for instances.
# Default is "49152-60000".
# Notice : 49152 is recommended as the minimal port.
# 	See http://www.tcpipguide.com/free/t_TCPIPApplicationAssignmentsandServerPortNumberRang-2.htm
export EZMASTER_FREE_PORT_RANGE="49152-60000"

# Environment variable specifying the instances public domain.
#
# Default is empty and it means the reverse proxy feature will not be enabled
#
# On the following example, if we have a "abc-def-4" (tech name) instance, then
# it will be joinable at this URL: http://abc-def-4.lod-test.istex.fr
# Tech. name is the prefix used and concatenated to the public domain
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"

```


## Install and run

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-prod
# make stop-prod to stop it
# ezmaster is listening at http://127.0.0.1:35267/
```

## Install and run for developments/debug
```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-debug
# ezmaster is listening at http://127.0.0.1:35267/
```

## Ezmasterizing an application
### Dockerfile modifications.
```shell
FROM ubuntu or node or ...

# 3000 is the default port.
EXPOSE 3000

RUN sudo mkdir -p /opt/ezmaster/config/
RUN sudo ln -s ###path to your config file### /opt/ezmaster/config/config.json
RUN sudo ln -s ###path to your data directory### /opt/ezmaster/data
```

### Create symbolic links for configuration and data files.
### Refer to the schema below.
![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/e648517de1edfdb07fcc4df36a2da0b3a93ce53b/doc/Ezmaster_Volume_Mounting.jpg)

Example:

EZVIS Dockerfile:

<https://github.com/madec-project/ezvis/blob/master/Docker/Dockerfile>

EZARK Dockerfile:

<https://github.com/Inist-CNRS/ezark/blob/master/Dockerfile>

EZPAARSE Dockerfile:

<https://hub.docker.com/r/ezpaarseproject/ezpaarse/~/dockerfile/>

## Diagrams

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Technical_Environment.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Architecture.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Main_Interactions.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/e648517de1edfdb07fcc4df36a2da0b3a93ce53b/doc/Ezmaster_Network.jpg)