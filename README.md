# ezmaster


[![french trello board](https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/doc/trello_20x20.png)](https://trello.com/b/GCu64gDf/ezmaster-suivi-du-projet) [![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster) [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/ezmaster/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/ezmaster)
[![Dependencies Status](https://david-dm.org/inist-cnrs/ezmaster.svg)](https://david-dm.org/inist-cnrs/ezmaster)
[![Docker Pulls](https://img.shields.io/docker/pulls/inistcnrs/ezmaster.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster/)
[![Ezmaster tweeter](https://img.shields.io/twitter/follow/inist_ezmaster.svg?style=social&label=Follow)](https://twitter.com/inist_ezmaster)

Administration of docker applications without any IT skills.

![ezmaster demo](/doc/anim3.gif)

## Requirements

- [Docker](https://docs.docker.com/engine/installation/) (Version ⩾ 17.09.0)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version ⩾ 1.17.0)
- For developments: [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and Make

## Environment variables

To configure ezmaster, setup these environment variables before running ezmaster:

```shell
# The user/password used to secure the ezmaster backoffice
# Default is none (not filled)
export EZMASTER_USER="ezmaster"
export EZMASTER_PASSWORD="changeme"

# The server IP where ezmaster is installed
# it will be used by the "Access" button to join instances on specific ports
# (one port for one instance, see EZMASTER_FREE_PORT_RANGE)
# Default is "127.0.0.1"
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"

# The ports range ezmaster is allowed to use to expose instances internal web
# address (revelant when reverse proxy is disabled)
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
mkdir ./ezmaster && cd ezmaster
mkdir -p ./data/applications ./data/instances ./data/manifests
mkdir -p ./logs/ezmaster-front/ ./logs/ezmaster-rp/instances/ ./logs/ezmaster-webdav/

wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/docker-compose.yml
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"
export EZMASTER_FREE_PORT_RANGE="49152-60000"
export EZMASTER_FULL_FS_PERCENT=80
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"
export EZMASTER_USER="ezmaster"
export EZMASTER_PASSWORD="changeme"
docker-compose up -d

# then ezmaster is listening at http://<Your ezmaster server IP>:35268
# and publicly available on http://ezmaster.lod-test.istex.fr (protected by login/pwd)
# and the instances can be accessed at http://<tech-name>.lod-test.istex.fr
```

## Install and run for developments/debug
```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install                   # installs npm dependencies
make build                     # builds the docker image used byt docker-compose.debug.yml
DEBUG=ezmaster* make run-debug # starts ezmaster in debug mode (CTRL+C to quit)
```
Then ezmaster is listening at http://127.0.0.1:35268/

## Ezmasterizing an application

### Dockerfile modifications

- Your application must have a web server (mandatory).
- Your application can use a json or text configuration file and a data folder (optional)

For example your dockerfile could look like this one:
```shell
FROM ubuntu or node or ...

#...

# 3000 is your web server listening port
EXPOSE 3000
# Then create the /etc/ezmaster.json in your docker image.
# It will tell to ezmaster where is your web server (ex: port 3000),
# where is your JSON configuration file,
# and where is your data folder
# "configType" value can be "json" or "text" depending on your config format
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/yourapp/config.json", \
  "configType": "json", \
  "dataPath": "/yourapp/data/" \
}' > /etc/ezmaster.json

# ...
```

### Dockerfile example of ezmasterized applications

- ezvis Dockerfile: https://github.com/madec-project/ezvis/blob/master/Dockerfile
- ezark Dockerfile: https://github.com/Inist-CNRS/ezark/blob/master/Dockerfile
- ezpaarse Dockerfile: https://github.com/ezpaarse-project/ezpaarse/blob/master/Dockerfile
- ezmaster-hexo Dockerfile: https://github.com/Inist-CNRS/ezmaster-hexo/blob/master/Dockerfile
- lodex Dockerfile: https://github.com/Inist-CNRS/lodex/blob/master/Dockerfile

### Environment variables available to your application

When ezmaster launches your application, it provides few environment variables
to this instance:

- `EZMASTER_MONGODB_HOST_PORT`: (will be deprecated in ezmaster v5), ex: `ezmaster_db:27017`
- `EZMASTER_TECHNICAL_NAME`: the identifier of the instance within ezmaster (ex: `myapp-usage-1`)
- `EZMASTER_LONG_NAME`: a free label for the instance (ex: `This instance is used for the customer C, and maintained by Matt`)
- `EZMASTER_APPLICATION`: the complete tag of your application's docker image (ex: `inistcnrs/ezmaster-hexo:1.0.3`)
- `EZMASTER_PUBLIC_URL`: if you use ezmaster's reverse proxy feature (using `EZMASTER_PUBLIC_DOMAIN`), it is the URL publicly available to your internet users (ex: `http://my-app-usage.public.dom`, when `EZMASTER_PUBLIC_DOMAIN`'s value is `public.dom`)
- `DEBUG`: this variable maybe useful to debug your application running via ezmaster (using the [debug module](https://www.npmjs.com/package/debug)), and logging your instance (via `docker logs myapp-usage-1`)
- `http_proxy`, `https_proxy`, `no_proxy`: these variables are taken from ezmaster's environment, and allow your application to use your proxy. They can be empty (especially if you don't use a proxy)


## How to for developers

### How to upgrade the internal docker client version inside the ezmaster's docker image ?

- Edit the [Dockerfile](https://github.com/Inist-CNRS/ezmaster/blob/master/Dockerfile)
- Change the DOCKER_VERSION parameter
- Browse to https://hub.docker.com/_/docker/ to get the correct DOCKER_SHA256 value and change it in the Dockerfile
- Test that everything works well after a : ``make build``

## How to for users

### How to test your first ezmaster application ? 

- Add the application
  - Open ezmaster web interface: http://<Your ezmaster server IP>:35268
  - Click the "Applications" tab, and "Add Application" button
  - Then write the name of the application ``inistcnrs/ezvis`` and its version ``6.8.13``
  - And click on "Create" and wait for the pull (it can take several minutes)

- Add the instance
  - Click on the "Instances" tab
  - Then click on "Add Instances" and choose ``inistcnrs/ezvis:6.8.13`` in the dropdown list
  - Enter "My first app" in the LongName field
  - Enter "myapp" in the first TechnicalName field, and "demo" in the second part
  - And click on "Create"

- Configure your instance
  - Then click on "Access..." to open ezvis application (it's empty but it's normal)
  - Then click on "Config" button and copy/past this file content: https://raw.githubusercontent.com/madec-project/showcase/master/demo_films/repository.json
  - Then click on "DATA" button and upload this file: https://github.com/madec-project/showcase/blob/master/demo_films/repository/films.csv
  - Then click again on "Access..." to open ezvis application and it should be filled with nice data

You finally should have something like this:

<img src="https://github.com/Inist-CNRS/ezmaster/blob/db46dccc532c3567b822f4f934b7cead0f4642f8/doc/ezvis_doc.png" height="250" />

## How to for production

### How to save the data and config of the instances ?

If you want to save the config and the data of your instances:
- you have to recursivly save the `data/applications`, `data/manifests` and `data/instances` folders (or simply `data/`).
- you also have to save the mongodb database contained in the ezmaster_db docker container: `docker exec -it ezmaster_db mongodump --quiet --archive=- > ezmaster_db_archive`
  (ezmaster_db will be deprecated in ezmaster ⩾ v5)


## Technical architecture

[![architecture 4.0](https://docs.google.com/drawings/d/e/2PACX-1vTAlDhUXFEigSwBPsAUH16E2Eqkb2OIJ7H1BaKk_zLd3_RJn3bmTIqnWYvbwqPsJs76RCCjCcZqyjEc/pub?w=791&amp;h=573)](https://docs.google.com/drawings/d/1Z-2F4o5PTx4Fsk5eBps8tKvh5Pf79zsSGLHUXv1UA18/edit)


## Changelog

### ezmaster 4.0.0

* Login/password feature is now available to protect ezmaster backoffice and webdav (env parameters are ``EZMASTER_USER`` and ``EZMASTER_PASSWORD``)

* EzMaster backoffice and webdav access are now publicly available (with login/pwd) when ``EZMASTER_PUBLIC_DOMAIN``, ``EZMASTER_USER``, and ``EZMASTER_PASSWORD`` are filled.
  Backoffice access exemple: http://ezmaster.mywebsite.com (if ``EZMASTER_PUBLIC_DOMAIN="mywebsite.com"``)
  Webdav access exemple: http://webdav.mywebsite.com

Breaking changes:
  
* docker and docker-compose need to be upgraded to docker >= 17.09.0 and docker-compose >= 1.17.0
* ezmaster backoffice is available on a new port: 35268
* ezmaster  api is now splitted on a dedicated port: 35269
* webdav access is still available but on a new port: 35270
* instances are available as before through a reverse proxy on the port 35267
  (but a rewritten reverse proxy based on nginx is now handling this feature)

Migration guide:

* be sure your ezmaster is in the version 3.8.x
* stop ezmaster and upgrade the host to docker >= 17.09.0 and docker-compose >= 1.17.0
* download and run the upgrade script (it will patch the docker container of the ezmaster instances):

  ```shell
  cd ezmaster/
  wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/scripts/upgrade-3.8-to-4.0
  chmod +x upgrade-3.8-to-4.0
  sudo EZMASTER_DATA_PATH=./data ./upgrade-3.8-to-4.0
  ```

* install the new ezmaster as usual

### ezmaster 3.8.0

- ezmaster is able to support `text` or `json` configuration for instances (see configPath and configType)

### ezmaster 3.5.1

Breaking changes:

* ezmaster is now running on a dedicated docker network 
* ezmaster instances are now taking the httpPort into the ``manifests/my-instance.json``

Migration guide

* after the new ezmaster version is installed and started, you have to connect all the existing ezmaster instances to the new ezmaster docker network this way:
  
  ```shell
  EZMASTER_INSTANCE="lodex-ezark-1" # this is an example, please adapt to your instance name
  docker network disconnect ezmaster_default $EZMASTER_INSTANCE
  docker network connect ezmaster_eznetwork $EZMASTER_INSTANCE
  ```

* check your instances manifest in ``data/manifests/*.json`` and add the "httpPort" key/value if not already existing. The value of the httpPort can be requested from the given ezmaster application with this shell command:
  
  ```shell
  EZMASTER_APPLICATION="inistcnrs/refgpec-api:1.0.8" # this is an example, please adapt to your application name
  docker run -it --rm --entrypoint="/bin/cat" $EZMASTER_APPLICATION /etc/ezmaster.json
  ```

