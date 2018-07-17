# EzMaster - Administration of docker applications without any IT skills

[![french trello board](https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/doc/trello_20x20.png)](https://trello.com/b/GCu64gDf/ezmaster-suivi-du-projet) [![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster) [![Dependencies Status](https://david-dm.org/inist-cnrs/ezmaster.svg)](https://david-dm.org/inist-cnrs/ezmaster) [![Docker Pulls](https://img.shields.io/docker/pulls/inistcnrs/ezmaster.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster/) [![Ezmaster tweeter](https://img.shields.io/twitter/follow/inist_ezmaster.svg?style=social&label=Follow)](https://twitter.com/inist_ezmaster)

EzMaster is a non-technical docker backoffice tools for non-IT administrators. It aims to manage applications and instances. One instance of an application is a docker packaged software having its own config and its own data. Each instance is a docker container, is isolated and independant, and can be stopped  or started easily on demand. Applications are "[ezmasterized](./EZMASTERIZED.md)" docker images, they can be easily downloaded  from dockerhub.


![ezmaster demo](/doc/anim3.gif)

Why are you here? you are insterested by ezmaster because you are a end-user, a developer, or an op guy?

* [EzMaster for end-users](USER.md)
* [EzMaster for dev](DEVELOPER.md)
* [EzMaster for ops](OPERATION.md)

You could also check all the EzMaster available versions at the [changelog page](CHANGELOG.md).
