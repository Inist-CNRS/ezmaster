# How to EzMasterize an application?

## Dockerfile modifications

- Your application must have a web server (mandatory).
- Your application can use a json or text configuration file and a data folder (optional)

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
# "configType" value can be "json" or "text" depending on your config format
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/yourapp/config.json", \
  "configType": "json", \
  "dataPath": "/yourapp/data/" \
}' > /etc/ezmaster.json

# ...
```

## Dockerfile example of ezmasterized applications

- ezvis Dockerfile: https://github.com/madec-project/ezvis/blob/master/Dockerfile
- ezark Dockerfile: https://github.com/Inist-CNRS/ezark/blob/master/Dockerfile
- ezpaarse Dockerfile: https://github.com/ezpaarse-project/ezpaarse/blob/master/Dockerfile
- ezmaster-hexo Dockerfile: https://github.com/Inist-CNRS/ezmaster-hexo/blob/master/Dockerfile
- lodex Dockerfile: https://github.com/Inist-CNRS/lodex/blob/master/Dockerfile

## Environment variables available to your application

When ezmaster launches your application, it provides few environment variables
to this instance:

- `EZMASTER_MONGODB_HOST_PORT`: (will be deprecated in ezmaster v5), ex: `ezmaster_db:27017`
- `EZMASTER_VERSION`: the current version of ezmaster (ex: `4.3.1`)
- `EZMASTER_TECHNICAL_NAME`: the identifier of the instance within ezmaster (ex: `myapp-usage-1`)
- `EZMASTER_LONG_NAME`: a free label for the instance (ex: `This instance is used for the customer C, and maintained by Matt`)
- `EZMASTER_APPLICATION`: the complete tag of your application's docker image (ex: `inistcnrs/ezmaster-hexo:1.0.3`)
- `EZMASTER_PUBLIC_URL`: if you use ezmaster's reverse proxy feature (using `EZMASTER_PUBLIC_PROTOCOL` and `EZMASTER_PUBLIC_DOMAIN`), it is the URL publicly available to your internet users (ex: `http://my-app-usage.public.dom`, when `EZMASTER_PUBLIC_DOMAIN`'s value is `public.dom`)
- `DEBUG`: this variable maybe useful to debug your application running via ezmaster (using the [debug module](https://www.npmjs.com/package/debug)), and logging your instance (via `docker logs myapp-usage-1`)
- `http_proxy`, `https_proxy`, `no_proxy`: these variables are taken from ezmaster's environment, and allow your application to use your proxy. They can be empty (especially if you don't use a proxy)


## EzMasterized application list

This formated list will be used by ezmaster itself to dynamicaly display a dropdown list when the administrator want to add a new application. Do not hesitate to update the list but you have to respect this simple formating.

### ezmaster-webserver

- A basic web server used to host static files
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-webserver.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-webserver/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-webserver.svg)](https://github.com/Inist-CNRS/ezmaster-webserver)

### ezmaster-phpserver

- PHP and Apache web server for EzMaster (usefull for Wordpress)
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-phpserver.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-phpserver/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-phpserver.svg)](https://github.com/Inist-CNRS/ezmaster-phpserver)

### ezmaster-mysql

- MySQL for ezmaster
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-mysql.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-mysql/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-mysql.svg)](https://github.com/Inist-CNRS/ezmaster-mysql)

### ezmaster-hexo

- Desc ...
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-hexo.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-hexo/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-hexo.svg)](https://github.com/Inist-CNRS/ezmaster-hexo)

### ezmaster-jekyll

- Jekyll for ezmaster! (a static web site generator)
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-jekyll.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-jekyll/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-jekyll.svg)](https://github.com/Inist-CNRS/ezmaster-jekyll)


### ezmaster-mongo

- MongoDB for ezmaster with an auto dump feature
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-mongo.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-mongo/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-mongo.svg)](https://github.com/Inist-CNRS/ezmaster-mongo)

### ezmaster-virtuoso

- Virtuoso (triple store) for ezmaster
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-virtuoso.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-virtuoso/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-virtuoso.svg)](https://github.com/Inist-CNRS/ezmaster-virtuoso)

### lodex

- Desc ...
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/lodex.svg)](https://registry.hub.docker.com/u/inistcnrs/lodex/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/lodex.svg)](https://github.com/Inist-CNRS/lodex)

### ezpaarse

- Desc ...
- [![Docker](https://img.shields.io/docker/pulls/ezpaarseproject/ezpaarse.svg)](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/) [![Github](https://img.shields.io/github/tag/ezpaarse-project/ezpaarse.svg)](https://github.com/ezpaarse-project/ezpaarse)

### ezmaster-web-term

- Web terminal used for debugging ezmaster stuff
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-web-term.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-web-term/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-web-term.svg)](https://github.com/Inist-CNRS/ezmaster-web-term)

### ezmaster-automaton

- Can be used to auto upgrade an ezmaster application/instance
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-automaton.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-automaton/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-automaton.svg)](https://github.com/Inist-CNRS/ezmaster-automaton)

### ezmaster-globs

- To backup Github repositories
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezmaster-globs.svg)](https://registry.hub.docker.com/u/inistcnrs/ezmaster-globs/) [![Github](https://img.shields.io/github/tag/Inist-CNRS/ezmaster-globs.svg)](https://github.com/Inist-CNRS/ezmaster-globs)

### bibliomap-viewer

- Desc ...
- [![Docker](https://img.shields.io/docker/pulls/ezpaarseproject/bibliomap-viewer.svg)](https://registry.hub.docker.com/u/ezpaarseproject/bibliomap-viewer/) [![Github](https://img.shields.io/github/tag/ezpaarse-project/bibliomap-viewer.svg)](https://github.com/ezpaarse-project/bibliomap-viewer)

### bibliomap-harvester

- Desc ...
- [![Docker](https://img.shields.io/docker/pulls/ezpaarseproject/bibliomap-harvester.svg)](https://registry.hub.docker.com/u/ezpaarseproject/bibliomap-harvester/) [![Github](https://img.shields.io/github/tag/ezpaarse-project/bibliomap-harvester.svg)](https://github.com/ezpaarse-project/bibliomap-harvester)

### bibliomap-enricher

- Desc ...
- [![Docker](https://img.shields.io/docker/pulls/ezpaarseproject/bibliomap-enricher.svg)](https://registry.hub.docker.com/u/ezpaarseproject/bibliomap-enricher/) [![Github](https://img.shields.io/github/tag/ezpaarse-project/bibliomap-enricher.svg)](https://github.com/ezpaarse-project/bibliomap-enricher)

### ezvis

- A dashboard to visualize a synthesis on a structured corpus, using several charts (pies, histograms, ...)
- [![Docker](https://img.shields.io/docker/pulls/inistcnrs/ezvis.svg)](https://registry.hub.docker.com/u/inistcnrs/ezvis/) [![Github](https://img.shields.io/github/tag/madec-project/ezvis.svg)](https://github.com/madec-project/ezvis)


