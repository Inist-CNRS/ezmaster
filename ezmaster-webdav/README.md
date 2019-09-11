# ezmaster-webdav

This image can be use standelone to simply share a given folder using a webdav share.

Here is a quick use case.

```shell
docker run --name my-webdav-share \
  -e EZMASTER_USER=user \
  -e EZMASTER_PASSWORD=password \
  -e DATA_FOLDER_NO_CHMOD=0 \
  -v /tmp/:/usr/local/apache2/htdocs/ \
  -p 35270:35270 \
  inistcnrs/ezmaster:5.2.7-webdav
```

WEBDAV_DATA_FOLDER is the local folder you want to share. The `$WEBDAV_DATA_FOLDER` content rights will be recursivly set to 777 by default. If you do not want this behavior, set the `DATA_FOLDER_NO_CHMOD` env var to `1`

EZMASTER_USER and EZMASTER_PASSWORD are the login/password used to protect read and writh access to WEBDAV_DATA_FOLDER through webdav.

Then your share is available at this URL:
http://127.0.0.1:35270/ (for windows) or dav://127.0.0.1:35270/ (for linux)
(change 127.0.0.1 with your server IP/hostname)
