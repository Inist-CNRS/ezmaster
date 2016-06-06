# ezmaster

Administration of docker applications without any IT skills.

## Requirements

- docker >= 1.10
- docker-compose version 2

#### Environement variables

```shell
# the IP ezmaster instances will use to be joinable from outside
# the following example uses the eth0 ip adress
export EZMASTER_PUBLIC_IP=$(ip addr show eth0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)
# the ports ezmarster is allowed to use for instances
export EZMASTER_FREE_PORT_RANGE="49152-60000"
# We recommend to use the port 49152 as minimal port
```


## Install and run

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-prod
# make stop-prod to stop it
# the app is listening at http://127.0.0.1:3000/
```


## Install and run for developements

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-dev
# the app is listening at http://127.0.0.1:3000/
```

## Install and run for debug
```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-debug
# the app is listening at http://127.0.0.1:3000/
```


