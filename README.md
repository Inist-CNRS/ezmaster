# ezmaster

Administration of docker applications without any IT skills.

## Requirements

- docker >= 1.10
- docker-compose version 1.7

#### Environement variables

```shell
# Environement variable the IP ezmaster instances will use to be joinable from outside.
export EZMASTER_PUBLIC_IP="Your IP"		ex : "182.16.103.206"
# Environement variable the ports ezmarster is allowed to use for instances.
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
# The app is listening at http://127.0.0.1:3000/.
```


## Install and run for developements

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-dev
# The app is listening at http://127.0.0.1:3000/.
```

## Install and run for debug
```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-debug
# The app is listening at http://127.0.0.1:3000/.
```


