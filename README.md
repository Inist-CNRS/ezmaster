# ezmaster

Administration of docker applications without any IT skills.

## Requirements

- docker-compose version 2

#### Environement variables

```shell
# the IP ezmaster instances will use to be joinable from outside
# the following example uses the eth0 ip adress
export EZMASTER_PUBLIC_IP=$(ip addr show eth0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)
# the ports ezmarster is allowed to use for instances
export EZMASTER_FREE_PORT_RANGE='49152-60000'
# We recommend to use the port 49152 as minimal port
```


## Install and run

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make docker-install
make docker-run-prod
# make docker-stop-prod to stop it
# if you have timeout during the pull, check 'Changing timeout' on this README
# the app is listening at http://127.0.0.1:3000/
```


## Install and run for developements

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make docker-install
make docker-run-dev
# if you have timeout during the pull, check 'Changing timeout' on this README
# the app is listening at http://127.0.0.1:3000/
```

## Install and run for debug
```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make docker-install
make docker-run-debug
# if you have timeout during the pull, check 'Changing timeout' on this README
# the app is listening at http://127.0.0.1:3000/
```

### Changing timeout

In castor-core module, in file "starter.js", please add 
```shell 
srv.timeout = 1E6;
```
at line 236.


