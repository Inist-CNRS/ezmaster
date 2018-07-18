# EzMaster changelog

EzMaster changelog lists what changed (features and bug fix) between all the ezmaster versions. [UPGRADE.md](UPGRADE.md) lists what specifically need to be done when upgrading ezmaster.

### ezmaster 5.X.X

* Now you cannot delete a used application

### ezmaster 5.1.2

* Add the remove application button
* Fix router problem when reverse proxy mode is enabled (ex: `/instances/` route is replaced by `#/instances/`)
* Fix EZMASTER_PUBLIC_DOMAIN feature (no more public link button displayed in the backoffice)

### ezmaster 5.0.0

This release do no brake anything API side or internaly. This is a mostly a full relooking of EzMaster UI.

* Adds an [ezmaster logo](./ezmaster-front/src/layout/ezmaster-logo-bg.png) (thanks to François Debeaupuis)
  ![logo](./ezmaster-front/src/layout/ezmaster-logo-header.png)
* Adds a sumup ezmaster homepage with customisable texts (thanks to the `EZMASTER_HOME_TITLE` and `EZMASTER_HOME_DESCRIPTION` env var)
* Improved webdav modal: mini-tutorial with cross-browsers screenshot
* Improved add instance modal: autocompleted technicalName from the typed longName
* Improved add application modal: larger input fields & better suggestion list with detailed informations (desc, ezmasterized, github)
* Adds "Size" columns to the instances and applications lists
* Adds "starting" status to the Start/Stop instances button action including a visual animated indicator
* Adds a loading data modal for waiting before ezmaster UI is ready
* Ezmaster UI is now fully SPA (single page application)
* Adds the `technicalApplication` flag to ezmasterized applications. It is used to filter these instances from the default instances list because end-user are not concerned by these instances. Ex: databases used by other instances

### ezmaster 4.4.0

* Add EZMASTER_VERSION variable in environment of instances
* Bug fix: try to avoid invalid technical name
* Bug fix: improved sorting of technical names, to get the last version of a instance
* README refactoring

### ezmaster 4.3.2

* Add the proxypreservehost feature on the ezmaster-rp's nginx config (needed especially by instances, ex: wordpress)
* Bug fix: somtime log button does not work because of a strange behavior on the [dockerode lib](https://github.com/apocas/dockerode/issues/456)
* EzMaster do not forbid anymore .git and .\* web folders

### ezmaster 4.3.1

* Fix webdav files permissions & access permissions.

### ezmaster 4.3.0

* Add the EZMASTER_PUBLIC_PROTOCOL env parameter. Use it with EZMASTER_PUBLIC_DOMAIN to switch to `https` if needed for your instances' public access URLs. Its default value is `http`. This env parameter is useless if you do not use the EZMASTER_PUBLIC_DOMAIN feature.

### ezmaster 4.2.0

* EZMASTER_UPLOAD_MAX_BODY_SIZE env parameter is now available. Use it to change the maximum upload size of on file (webdav or backoffice upload). Its default value is 500M
  See http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size for information where this parameter is used.

### ezmaster 4.1.0

* ezmaster-webdav docker image is now usable as a standalone image. A classic usecase is to quickly and easily share a given folder to a windows user.

### ezmaster 4.0.0

* Login/password feature is now available to protect ezmaster backoffice and webdav (env parameters are `EZMASTER_USER` and `EZMASTER_PASSWORD`)

* EzMaster backoffice and webdav access are now publicly available (with login/pwd) when `EZMASTER_PUBLIC_DOMAIN`, `EZMASTER_USER`, and `EZMASTER_PASSWORD` are filled.
  Backoffice access exemple: http://ezmaster.mywebsite.com (if `EZMASTER_PUBLIC_DOMAIN="mywebsite.com"`)
  Webdav access exemple: http://webdav.mywebsite.com

Breaking changes:

* docker and docker-compose need to be upgraded to docker >= 17.05.0 and docker-compose >= 1.17.0
* ezmaster backoffice is available on a new port: 35268
* ezmaster api is now splitted on a dedicated port: 35269
* webdav access is still available but on a new port: 35270
* instances are available as before through a reverse proxy on the port 35267
  (but a rewritten reverse proxy based on nginx is now handling this feature)

See [upgrade instructions](UPGRADE.md).

### ezmaster 3.8.3

* ezmaster instance's config file size can now be upper than 100kb (limit is now 100mb)

### ezmaster 3.8.0

* ezmaster is able to support `text` or `json` configuration for instances (see configPath and configType)

### ezmaster 3.5.1

Breaking changes:

* ezmaster is now running on a dedicated docker network
* ezmaster instances are now taking the httpPort into the `manifests/my-instance.json`

See [upgrade instructions](UPGRADE.md).
