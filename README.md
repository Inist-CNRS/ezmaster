# ezmaster

[![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster) [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/ezmaster/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/ezmaster)

Administration of docker applications without any IT skills.

## Requirements

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://docs.docker.com/engine/installation/) (Version >= 1.12)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version >= 1.7)
- Make

## Environment variables

To configure ezmaster, setup these environment variables before running ezmaster:

```shell
# The IP ezmaster instances will use to be joinable from outside.
# Default is "127.0.0.1"
export EZMASTER_PUBLIC_IP="Your IP"


# The ports range ezmaster is allowed to use to expose instances internal web address
# (revelant when reverse proxy is disabled)
# Default is "49152-60000".
# Notice : 49152 is recommended as the minimal port.
# 	See http://www.tcpipguide.com/free/t_TCPIPApplicationAssignmentsandServerPortNumberRang-2.htm
export EZMASTER_FREE_PORT_RANGE="49152-60000"

# The instances public domain used by the ezmaster's reverse proxy feature.
# (it allows to access instances through a wildcard public domain)
## Default is empty and it means the reverse proxy feature is disabled
#
# On the following example, if we have a "abc-def-4" (tech name) instance, then
# it will be joinable at this URL: http://abc-def-4.lod-test.istex.fr
# Tech. name is the prefix used and concatenated to the public domain
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"

# The maximum total size allowed for files upload through the "DATA instances feature".
# Default value is approximately 10Go.
export EZMASTER_MAX_SIZE_UPLOAD=1000000000

# The maximum total free space percent of the disk for avoiding saturation.
# Default value is 80%.
export EZMASTER_FULL_FS_PERCENT=80
```

## Communication with the Database (Mongo)

```shell
# You have to link your database to the ezmaster database. 
# Regarding to this, you have to use the envrionment variable : EZMASTER_MONGODB_HOST_PORT
```


## Install and run for production

```shell
mkdir ./ezmaster
cd ezmaster
mkdir ./applications
mkdir ./instances
mkdir ./manifests
wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/docker-compose.yml
export EZMASTER_PUBLIC_IP="Your IP"
export EZMASTER_FREE_PORT_RANGE="49152-60000"
export EZMASTER_FULL_FS_PERCENT=80
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"
docker-compose up -d

# then ezmaster is listening at http://<Your IP>:35267
# and the instances can be accessed at http://<tech-name>.lod-test.istex.fr
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


## How to test your first ezmaster application ? 


```shell
# You have to add your application image
# Click the "Applications" tab, and "Add Application" button
# Then you have to write the name of your applications and his tag.
# If you applications is not on Docker Hub, click on "settings" and filled the fields.
# Finnaly click on "Create"

# When the pull is finished you will be reload on the "Instances" tab
# Then click on "Add Instances" and choose your applications in the dropdown tab
# Filled the longName and technicaleName, and click on "Create"

# Now you can access, stop, delete, configurate or add data to your Instance.
```

## How to save and restore the data and config of the instances ?

```shell
# If you want to save the config and the data of your instances
# You have to save the "manifests" and "instances" files.
# And when you will recreate or add a new EzMaster you will have to:

# Add all the applications (Docker images) of the instances concerned
# And put what you had saved into the "instances" and "manifests" files of your new EzMaster 
```


## Diagrams

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Technical_Environment.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Architecture.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Main_Interactions.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/e648517de1edfdb07fcc4df36a2da0b3a93ce53b/doc/Ezmaster_Network.jpg)

## How to for developers

### How to upgrade the internal docker client version inside the ezmaster's docker image ?

- Edit the [Dockerfile](https://github.com/Inist-CNRS/ezmaster/blob/master/Dockerfile)
- Change the DOCKER_VERSION parameter
- Browse to https://hub.docker.com/_/docker/ to get the correct DOCKER_SHA256 value and change it in the Dockerfile
- Test that everything works well after a : ``make build``
