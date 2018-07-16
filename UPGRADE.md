# EzMaster upgrade instructions

EzMaster upgrade instructions are useful when upgrading ezmaster from one version to another one.
[CHANGELOG.md](CHANGELOG.md) lists what features and bug fixes are related to every ezmaster versions.

### Upgrade from ezmaster 4.4.0 to ezmaster 5.0.0

* Include the `EZMASTER_HOME_TITLE` and `EZMASTER_HOME_DESCRIPTION` env var to your deployment process. Empty value are ok or ask the ezmaster administrator the correct values to setup. (see also [parameters explanation](./DEVELOPER.md#environment-variables))

### Upgrade from ezmaster 3.8.3 to ezmaster 4.0.0

* be sure your ezmaster is in the version 3.8.3
* stop ezmaster and upgrade the host to docker >= 17.05.0 and docker-compose >= 1.17.0
* download and run the upgrade script this way (it will patch the docker container of the ezmaster instances):

  ```shell
  cd ezmaster/
  wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/scripts/upgrade-3.8-to-4.0
  chmod +x upgrade-3.8-to-4.0
  sudo DOCKER_VAR_LIB_PATH=/var/lib/docker EZMASTER_DATA_PATH=./data ./upgrade-3.8-to-4.0
  ```

* upgrade to ezmaster 4.x.x as usual
* don't forget to add the `ProxyPreserveHost On` apache2 configuration on your front reverse proxy if you are using the `EZMASTER_PUBLIC_DOMAIN` feature (do it for all the ezmaster's instance configurations)

### Upgrade from ezmaster 3.5.0 to ezmaster 3.5.1

* after ezmaster 3.5.1 version is installed and started, you have to connect all the existing ezmaster instances to the new ezmaster docker network this way (do it for all your instances):

  ```shell
  EZMASTER_INSTANCE="lodex-ezark-1" # this is an example, please adapt to your instance name
  docker network disconnect ezmaster_default $EZMASTER_INSTANCE
  docker network connect ezmaster_eznetwork $EZMASTER_INSTANCE
  ```

* check your instances manifest in `data/manifests/*.json` and add the "httpPort" key/value if not already existing. The value of the httpPort can be requested from the given ezmaster application with this shell command (do it for all your instances):

  ```shell
  EZMASTER_APPLICATION="inistcnrs/refgpec-api:1.0.8" # this is an example, please adapt to your application name
  docker run -it --rm --entrypoint="/bin/cat" $EZMASTER_APPLICATION /etc/ezmaster.json
  ```
