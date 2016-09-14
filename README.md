# ezmaster


[![french trello board](https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/doc/trello_20x20.png)](https://trello.com/b/GCu64gDf/ezmaster-suivi-du-projet) [![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster) [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/ezmaster/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/ezmaster)

[![Docker status](http://dockeri.co/image/ezpaarseproject/ezpaarse)](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/)

Administration of docker applications without any IT skills.

## Requirements

- [Docker](https://docs.docker.com/engine/installation/) (Version >= 1.12)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version >= 1.7)
- For developments: [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and Make

## Environment variables

To configure ezmaster, setup these environment variables before running ezmaster:

```shell
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
mkdir ./applications ./instances ./manifests

wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/docker-compose.yml
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"
export EZMASTER_FREE_PORT_RANGE="49152-60000"
export EZMASTER_FULL_FS_PERCENT=80
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"
docker-compose up -d

# then ezmaster is listening at http://<Your ezmaster server IP>:35267
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
Then ezmaster is listening at http://127.0.0.1:35267/

## Ezmasterizing an application

### Dockerfile modifications

- Your application must have a web server (mandatory).
- Your application can use a json config and a data folder (optional)

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
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/yourapp/config.json", \
  "dataPath": "/yourapp/data/" \
}' > /etc/ezmaster.json

# ...
```

### MongoDB database (optional)

If your application uses a mongodb database, your can use the ezmaster database.
Regarding this, you just have to use the environment variable: ``EZMASTER_MONGODB_HOST_PORT``.
This variable will contain something like this: ``ezmaster_db:27017`` (it means that mongodb host is ezmaster_db and mongodb port is 27017).

### Dockerfile example of ezmasterized applications

- ezvis Dockerfile: https://github.com/madec-project/ezvis/blob/master/Docker/Dockerfile
- ezark Dockerfile: https://github.com/Inist-CNRS/ezark/blob/master/Dockerfile
- ezpaarse Dockerfile: https://github.com/ezpaarse-project/ezpaarse/blob/master/Dockerfile
- ezmaster-hexo Dockerfile: https://github.com/Inist-CNRS/ezmaster-hexo/blob/master/Dockerfile
- lodex Dockerfile: https://github.com/Inist-CNRS/lodex/blob/master/Dockerfile

### Environment variables available to your application

When ezmaster launches your application, it provides few environment variables
to this instance:

- `EZMASTER_MONGODB_HOST_PORT`: (see above), ex: `ezmaster_db:27017`
- `EZMASTER_TECHNICAL_NAME`: the identifier of the instance within ezmaster (ex: `myapp-usage-1`)
- `EZMASTER_LONG_NAME`: a free label for the instance (ex: `This instance is used for the customer C, and maintained by Matt`)
- `EZMASTER_APPLICATION`: the complete tag of your application's docker image (ex: `inistcnrs/ezmaster-hexo:1.0.3`)
- `EZMASTER_PUBLIC_URL`: if you use ezmaster's reverse proxy feature (using `EZMASTER_PUBLIC_DOMAIN`), it is the URL publicly available to your internet users (ex: `http://my-app-usage.public.dom`, when `EZMASTER_PUBLIC_DOMAIN`'s value is `public.dom`)
- `DEBUG`: this variable maybe useful to debug your application running via ezmaster (using the [debug module](https://www.npmjs.com/package/debug)), and logging your instance (via `docker logs myapp-usage-1`)
- `http_proxy`, `https_proxy`: these variables are taken from ezmaster's environment, and allow your application to use your proxy. They can be empty (especially if you don't use a proxy)


## How to for developers

### How to upgrade the internal docker client version inside the ezmaster's docker image ?

- Edit the [Dockerfile](https://github.com/Inist-CNRS/ezmaster/blob/master/Dockerfile)
- Change the DOCKER_VERSION parameter
- Browse to https://hub.docker.com/_/docker/ to get the correct DOCKER_SHA256 value and change it in the Dockerfile
- Test that everything works well after a : ``make build``

## How to for users

### How to test your first ezmaster application ? 

- Add the application
  - Open ezmaster web interface: http://<Your ezmaster server IP>:35267
  - Click the "Applications" tab, and "Add Application" button
  - Then write the name of the application ``inistcnrs/ezvis`` and its version ``6.8.6``
  - And click on "Create" and wait for the pull (it can take several minutes)

- Add the instance
  - Click on the "Instances" tab
  - Then click on "Add Instances" and choose ``inistcnrs/ezvis:6.8.6`` in the dropdown list
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
- you have to save the `applications`, `manifests` and `instances` files.
- you also have to save the mongodb database on the address : `mongodb://ezmaster_db:27017`



## Diagrams

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Technical_Environment.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Architecture.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/a83d22094a3c78cac94b8b5acc59d178871472f9/doc/Ezmaster_Main_Interactions.jpg)

![alt tag](https://github.com/Inist-CNRS/ezmaster/blob/e648517de1edfdb07fcc4df36a2da0b3a93ce53b/doc/Ezmaster_Network.jpg)


