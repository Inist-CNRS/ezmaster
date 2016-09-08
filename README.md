# ezmaster


[![french trello board](https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/doc/trello_20x20.png)](https://trello.com/b/GCu64gDf/ezmaster-suivi-du-projet) [![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster) [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/ezmaster/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/ezmaster)

Administration of docker applications without any IT skills.

## Requirements

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://docs.docker.com/engine/installation/) (Version >= 1.12)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version >= 1.7)
- Make

## Environment variables

To configure ezmaster, setup these environment variables before running ezmaster:

```shell
# The server IP where ezmaster is installed
# it will be used by the "Access" button to join instances on specific ports
# (one port for one instance, see EZMASTER_FREE_PORT_RANGE)
# Default is "127.0.0.1"
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"


# The ports range ezmaster is allowed to use to expose instances internal web address
# (revelant when reverse proxy is disabled)
# Default is "49152-60000".
# Notice : 49152 is recommended as the minimal port.
# 	See http://www.tcpipguide.com/free/t_TCPIPApplicationAssignmentsandServerPortNumberRang-2.htm
export EZMASTER_FREE_PORT_RANGE="49152-60000"

# The instances public domain used by the ezmaster's reverse proxy feature.
# (it allows to access instances through a wildcard public domain)
# Default is empty and it means the reverse proxy feature is disabled
#
# On the following example, if we have a "abc-def-4" (tech name) instance, then
# it will be joinable at this URL: http://abc-def-4.lod-test.istex.fr
# Tech. name is the prefix used and concatenated to the public domain
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"

# The maximum total free space percent of the disk for avoiding saturation.
# Default value is 80%.
export EZMASTER_FULL_FS_PERCENT=80
```



## Install and run for production

```shell
mkdir ./ezmaster
cd ezmaster
mkdir ./applications
mkdir ./instances
mkdir ./manifests
wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/docker-compose.yml
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"
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

### Dockerfile modifications

- Your application must have a web server listening on port 3000 (mandatory).
- Your application can use a json config and a data folder (optional)

For example your dockerfile could looks like this one:
```shell
FROM ubuntu or node or ...

# 3000 is the default port.
EXPOSE 3000

# WARNING: put this line AFTER your CMD line
# Otherwise the links don't work
RUN sudo mkdir -p /opt/ezmaster/config/
RUN sudo ln -s ###path to your config file### /opt/ezmaster/config/config.json
RUN sudo ln -s ###path to your data directory### /opt/ezmaster/data
```

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/e648517de1edfdb07fcc4df36a2da0b3a93ce53b/doc/Ezmaster_Volume_Mounting.jpg)

### MongoDB database (optional)

If your application uses a mongodb database, your can use the ezmaster database. 
Regarding to this, you just have to use the envrionment variable: ``EZMASTER_MONGODB_HOST_PORT``
This variable contains for example: ``ezmaster_db:27017`` (it means that mongodb host is ezmaster_db and mongodb port is 27017)

### Dockerfile example of ezmasterized applications

- EZVIS Dockerfile: https://github.com/madec-project/ezvis/blob/master/Docker/Dockerfile
- EZARK Dockerfile: https://github.com/Inist-CNRS/ezark/blob/master/Dockerfile
- EZPAARSE Dockerfile: https://github.com/ezpaarse-project/ezpaarse/blob/master/Dockerfile

## How to for developers

### How to upgrade the internal docker client version inside the ezmaster's docker image ?

- Edit the [Dockerfile](https://github.com/Inist-CNRS/ezmaster/blob/master/Dockerfile)
- Change the DOCKER_VERSION parameter
- Browse to https://hub.docker.com/_/docker/ to get the correct DOCKER_SHA256 value and change it in the Dockerfile
- Test that everything works well after a : ``make build``

## How to for users

### How to test your first ezmaster application ? 

- Open ezmaster web interface: http://<Your ezmaster server IP>:35267
- Click the "Applications" tab, and "Add Application" button
- Then write the name of the application ``inistcnrs/ezvis`` and its version ``6.8.6``
- And click on "Create" and wait for the pull (it can take several minutes)

- Click on the "Instances" tab
- Then click on "Add Instances" and choose ``inistcnrs/ezvis:6.8.6`` in the dropdown list
- Enter "My first app" in the LongName field
- Enter "myapp" in the first TechnicalName field, and "demo" in the second part
- And click on "Create"

- Then click on "Access..." to open ezvis application (it's empty but it's normal)
- Then click on "Config" button and copy/past this file content: https://raw.githubusercontent.com/madec-project/showcase/master/demo_films/repository.json
- Then click on "DATA" button and upload this file: https://github.com/madec-project/showcase/blob/master/demo_films/repository/films.csv
- Then click again on "Access..." to open ezvis application and it should be filled with nice data

You finally should have something like this:

<img src="https://github.com/Inist-CNRS/ezmaster/blob/db46dccc532c3567b822f4f934b7cead0f4642f8/doc/ezvis_doc.png" height="250" />

## How to for production

### How to save the data and config of the instances ?

- If you want to save the config and the data of your instances
- You have to save the "applications, "manifests" and "instances" files.
- You also have to save the mongodb database on the address : mongodb://ezmaster_db:27017



## Diagrams

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Technical_Environment.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Architecture.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Main_Interactions.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/e648517de1edfdb07fcc4df36a2da0b3a93ce53b/doc/Ezmaster_Network.jpg)



## Next

[All is in our french trello board](https://trello.com/b/GCu64gDf/ezmaster-suivi-du-projet)
