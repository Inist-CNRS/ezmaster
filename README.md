# ezmaster

Administration of docker applications without any IT skills.

## Requirements

- docker-compose version 2


## Install and run

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make docker-run-prod
# if you have timeout during the pull, check 'Changing timeout' on this README
# the app is listening at http://127.0.0.1:3000/
```


## Install and run for developements

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make docker-run-debug
# if you have timeout during the pull, check 'Changing timeout' on this README
# the app is listening at http://127.0.0.1:3000/
```


### Adding a default instance

You can add a default instance with the button 'Add an instance'.


### Changing timeout

In castor-core module, in file "starter.js", please add 
```shell 
srv.timeout = 1E6;
```
at line 236.


