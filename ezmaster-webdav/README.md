# ezmaster-webdav

This image can be use standelone to simply share a given folder using a webdav share.

Here is a quick usecase.

```shell
export WEBDAV_DATA_FOLDER=/tmp
export EZMASTER_USER=user
export EZMASTER_PASSWORD=password
export DATA_FOLDER_NO_CHMOD=0

docker run --name my-webdav-share \
  -e EZMASTER_USER -e EZMASTER_PASSWORD -e DATA_FOLDER_NO_CHMOD \
  -v $WEBDAV_DATA_FOLDER:/usr/local/apache2/htdocs/ \
  -p 35270:35270 \
  inistcnrs/ezmaster:5.1.1-webdav
```

WEBDAV_DATA_FOLDER is the folder you want to share. The `$WEBDAV_DATA_FOLDER` content rights will be recursivly set to 777 by default. If you do not want this behavior, set the `DATA_FOLDER_NO_CHMOD` env var to `1`

EZMASTER_USER and EZMASTER_PASSWORD are the login/password used to protect read and writh access to WEBDAV_DATA_FOLDER through webdav.

Then your share is available at this URL:
http://127.0.0.1:35270/ (for windows) or dav://127.0.0.1:35270/ (for linux)
(change 127.0.0.1 with your server IP/hostname)
