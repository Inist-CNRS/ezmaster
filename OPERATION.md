# EzMaster for ops

EzMaster has [requirements](DEVELOPER.md#requirements) and can be [customized with env parameters](DEVELOPER.md#environment-variables).

## Install and run for production

```shell
mkdir ./ezmaster && cd ezmaster
mkdir -p ./data/applications ./data/instances ./data/manifests
mkdir -p ./logs/ezmaster-front/ ./logs/ezmaster-rp/instances/ ./logs/ezmaster-webdav/

wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/4.4.0/docker-compose.yml
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"
export EZMASTER_FREE_PORT_RANGE="49152-60000"
export EZMASTER_FULL_FS_PERCENT=80
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"
export EZMASTER_PUBLIC_PROTOCOL="http"
export EZMASTER_USER="ezmaster"
export EZMASTER_PASSWORD="changeme"
export EZMASTER_HOME_TITLE=""
export EZMASTER_HOME_DESCRIPTION=""
docker-compose up -d

# then ezmaster is listening at http://<Your ezmaster server IP>:35268
# and publicly available on http://ezmaster.lod-test.istex.fr (protected by login/pwd)
# and the instances can be accessed at http://<tech-name>.lod-test.istex.fr
```

When you want to **upgrade EzMaster**, you just have to download the new EzMaster docker-compose.yml file add the (maybe) new env parameters, follow the [upgrade instructions](UPGRADE.md) and type again `docker-compose up -d`

## FAQ

### How to backup instances (data and config)?

If you want to save the config and the data of your instances:

* you have to recursivly save the `data/applications`, `data/manifests` and `data/instances` folders (or simply `data/`).
* you also have to save the mongodb database contained in the ezmaster_db docker container:

  ```
  docker exec -it ezmaster_db mongodump --quiet --archive=- > ezmaster_db_archive
  ```

  (ezmaster_db will be deprecated in ezmaster ⩾ v6)

### How to use ezmaster behind Apache reverse proxy?

You should add a dedicated VirtualHost:

```
<VirtualHost *:80>
    ServerName exemple.fr
    ServerAlias *.exemple.fr
    ProxyPreserveHost On
    ProxyPass        / http://192.168.100.10:35267/ retry=5   # Replace IP with yours ezmaster IP
    ProxyPassReverse / http://192.168.100.10:35267/   # Replace IP with yours ezmaster IP
</VirtualHost>
<VirtualHost *:443>
    ServerName exemple.fr
    ServerAlias *.exemple.fr

    SSLEngine on
    SSLProxyEngine on
    SSLCACertificateFile  /your/path/to/DigiCertCA.crt
    SSLCertificateFile    /your/path/to/exemple_fr.crt
    SSLCertificateKeyFile /your/path/to/exemple_fr.key

    ProxyPreserveHost On
    ProxyPass        / http://192.168.100.10:35267/ retry=5   # Replace IP with yours ezmaster IP
    ProxyPassReverse / http://192.168.100.10:35267/   # Replace IP with yours ezmaster IP
</VirtualHost>
```

### How to use ezmaster behind Apache reverse proxy with a custom domain?

```
<VirtualHost *:80>
    ServerName www.exemple.fr
    RequestHeader set Host "technical-name.example.fr"  # supposing exemple.fr is a value of EZMASTER_PUBLIC_DOMAIN (env. var.)
    ProxyPreserveHost On
    ProxyPass        / http://192.168.100.10:35267/ retry=5  # Replace IP with yours ezmaster IP
    ProxyPassReverse / http://192.168.100.10:35267/   # Replace IP with yours ezmaster IP
</VirtualHost>
```
