#!/bin/sh -eux

# cleanup all the instances conf at startup
# because if one instance is not listening, nginx will just not start...
rm -f /etc/nginx/conf.d/*.conf
# copy the last version of the templates
cp -f /etc/nginx/ezmaster-instance-nginx.conf.tpl /etc/nginx/conf.d/ 
cp -f /etc/nginx/ezmaster-front-nginx.conf.tpl    /etc/nginx/conf.d/ 
cp -f /etc/nginx/ezmaster-webdav-nginx.conf.tpl   /etc/nginx/conf.d/ 

EZMASTER_UPLOAD_MAX_BODY_SIZE=${EZMASTER_UPLOAD_MAX_BODY_SIZE:-"500M"}
sed -i "s#client_max_body_size 500M#client_max_body_size $EZMASTER_UPLOAD_MAX_BODY_SIZE#g" /etc/nginx/conf.d/ezmaster-front-nginx.conf.tpl
sed -i "s#client_max_body_size 500M#client_max_body_size $EZMASTER_UPLOAD_MAX_BODY_SIZE#g" /etc/nginx/conf.d/ezmaster-webdav-nginx.conf.tpl
sed -i "s#client_max_body_size 500M#client_max_body_size $EZMASTER_UPLOAD_MAX_BODY_SIZE#g" /etc/nginx/conf.d/ezmaster-instance-nginx.conf.tpl

# create log folder if necessary
mkdir -p /var/log/nginx/ezmaster-rp/instances/

exec "$@"
