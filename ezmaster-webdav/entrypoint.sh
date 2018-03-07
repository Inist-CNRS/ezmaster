#!/bin/bash -eux

# remove port 80 adjust to 35270
sed -i 's%Listen 80%Listen 35270%g' /usr/local/apache2/conf/httpd.conf

# enable webdav modules for apache2
sed -i 's%^#LoadModule dav_module modules/mod_dav.so%LoadModule dav_module modules/mod_dav.so%g' \
    /usr/local/apache2/conf/httpd.conf
sed -i 's%^#LoadModule dav_fs_module modules/mod_dav_fs.so%LoadModule dav_fs_module modules/mod_dav_fs.so%g' \
    /usr/local/apache2/conf/httpd.conf
sed -i 's%^#LoadModule dav_lock_module modules/mod_dav_lock.so%LoadModule dav_lock_module modules/mod_dav_lock.so%g' \
    /usr/local/apache2/conf/httpd.conf
sed -i 's%^#LoadModule auth_digest_module modules/mod_auth_digest.so%LoadModule auth_digest_module modules/mod_auth_digest.so%g' \
    /usr/local/apache2/conf/httpd.conf
sed -i 's%^#Include conf/extra/httpd-dav.conf%Include conf/extra/httpd-dav.conf%g' \
    /usr/local/apache2/conf/httpd.conf

# where webdav data will be written
if [ "${DATA_FOLDER_NO_CHMOD:-}" == "" ] || [ "${DATA_FOLDER_NO_CHMOD:-}" == "0" ]; then
  chmod -R ugo+rwx /usr/local/apache2/htdocs/
fi

# log stuff
mkdir -p /var/log/apache2/
sed -i 's%/proc/self/fd/2%/var/log/apache2/error.log%g'  /usr/local/apache2/conf/httpd.conf
sed -i 's%/proc/self/fd/1%/var/log/apache2/access.log%g' /usr/local/apache2/conf/httpd.conf

# authentication stuff enabled or disabled
if [ -n "${EZMASTER_USER:-}" ] && [ -n "${EZMASTER_PASSWORD:-}" ]; then
  # generates the login/mdp password file
  digest="$( printf "%s:%s:%s" "$EZMASTER_USER" "DAV-upload" "$EZMASTER_PASSWORD" | 
             md5sum | awk '{print $1}' )"
  printf "%s:%s:%s\n" "$EZMASTER_USER" "DAV-upload" "$digest" > "/usr/local/apache2/user.passwd"
  cp -f /usr/local/apache2/conf/extra/httpd-dav.conf.orig \
        /usr/local/apache2/conf/extra/httpd-dav.conf
else
  echo "Disable webdav authentication stuff"
  grep -v -E "AuthType|AuthName|AuthUserFile|AuthDigestProvider|LimitExcept|Require user" \
    /usr/local/apache2/conf/extra/httpd-dav.conf.orig \
    > /usr/local/apache2/conf/extra/httpd-dav.conf
fi

# exec the CMD (see Dockerfile)
exec "$@"