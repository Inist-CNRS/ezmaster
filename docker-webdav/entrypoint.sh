#!/bin/sh -eux

if [ -n "${WEBDAV_USERNAME:-}" ] && [ -n "${WEBDAV_PASSWORD:-}" ]; then
    htpasswd -bc /etc/nginx/webdavpasswd $WEBDAV_USERNAME $WEBDAV_PASSWORD
else
    echo "No htpasswd config done"
    sed -i 's%auth_basic "Restricted";% %g' /etc/nginx/nginx.conf
    sed -i 's%auth_basic_user_file webdavpasswd;% %g' /etc/nginx/nginx.conf
fi

# adjust the UID/GID stuff to allow webdav to write into the /media shared folder
THE_UID=$(ls -ld /media/ | awk '{print $3}')
THE_GID=$(ls -ld /media/ | awk '{print $4}')
chmod go+w /dev/stderr /dev/stdout
gosu $THE_UID mkdir -p /media/.tmp

exec gosu $THE_UID "$@"