# ezmaster

[![Build Status](https://travis-ci.org/Inist-CNRS/ezmaster.svg?branch=master)](https://travis-ci.org/Inist-CNRS/ezmaster)

Administration of docker applications without any IT skills.

## Requirements

- docker version >= 1.10
- docker-compose version >= 1.7

#### Environement variables

```shell
# Environement variable the IP ezmaster instances will use to be joinable from outside.
export EZMASTER_PUBLIC_IP="Your IP"
# Environement variable the ports ezmaster is allowed to use for instances.
export EZMASTER_FREE_PORT_RANGE="49152-60000"
# We recommend to use the port 49152 as minimal port.
```


## Install and run

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-prod
# make stop-prod to stop it
# ezmaster is listening at http://127.0.0.1:3000/
```


## Install and run for developments

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-dev
# ezmaster is listening at http://127.0.0.1:3000/
```

## Install and run for debug
```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-debug
# ezmaster is listening at http://127.0.0.1:3000/
```


