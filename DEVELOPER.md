# EzMaster for developers

## Requirements

- [Docker](https://docs.docker.com/engine/installation/) (Version ⩾ 17.05.0)
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
# It you enable this feature, do not forget to configure your front reverse proxy
# on this access point: http://<ezmaster-server-host>:35267
# Warning: don't forget to add this apache2 configuration on your front reverse proxy
#          ProxyPreserveHost On
#
# On the following example, if we have a "abc-def-4" (tech name) instance, then
# it will be joinable at this URL: http://abc-def-4.lod-test.istex.fr
# Tech. name is the prefix used and concatenated to the public domain
# 
# If EZMASTER_PUBLIC_DOMAIN, EZMASTER_USER and EZMASTER_PASSWORD are filled 
# it enables two features:
# 1) ezmaster backoffice will be publicaly accessible http://ezmaster.lod-test.istex.fr
# 2) a webdav endpoint will be publicaly accessible http://webdav.lod-test.istex.fr
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"
# Used for your instances' public access URLs. Contains "http" or "https".
# Default is "http"
export EZMASTER_PUBLIC_PROTOCOL="http"

# The maximum total free space percent of the disk for avoiding saturation.
# Default value is 80%.
export EZMASTER_FULL_FS_PERCENT=80

# The maximum upload size of on file
# Default value is 500M (means 500 Megabytes)
export EZMASTER_UPLOAD_MAX_BODY_SIZE="500M"
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

If you are interested to [create your own ezmasterized application, follow the how to](EZMASTERIZED.md).

## Technical architecture

[![architecture 4.0](https://docs.google.com/drawings/d/e/2PACX-1vTAlDhUXFEigSwBPsAUH16E2Eqkb2OIJ7H1BaKk_zLd3_RJn3bmTIqnWYvbwqPsJs76RCCjCcZqyjEc/pub?w=791&amp;h=573)](https://docs.google.com/drawings/d/1Z-2F4o5PTx4Fsk5eBps8tKvh5Pf79zsSGLHUXv1UA18/edit)

## FAQ

### How to upgrade the internal docker client version inside the ezmaster's docker image ?

- Edit the [Dockerfile](https://github.com/Inist-CNRS/ezmaster/blob/master/Dockerfile)
- Change the DOCKER_VERSION parameter
- Browse to https://hub.docker.com/_/docker/ to get the correct DOCKER_SHA256 value and change it in the Dockerfile
- Test that everything works well after a : ``make build``

