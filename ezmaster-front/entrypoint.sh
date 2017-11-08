#!/bin/sh -eux

cp -f /etc/nginx/nginx.conf.orig /etc/nginx/nginx.conf

# auth stuff
if [ -n "${EZMASTER_USER:-}" ] && [ -n "${EZMASTER_PASSWORD:-}" ]; then
  htpasswd -bc /etc/nginx/.htpasswd $EZMASTER_USER $EZMASTER_PASSWORD
else
  echo "No htpasswd config done"
  sed -i 's%auth_basic "Restricted";% %g' /etc/nginx/nginx.conf
  sed -i 's%auth_basic_user_file .htpasswd;% %g' /etc/nginx/nginx.conf
fi

exec "$@"
