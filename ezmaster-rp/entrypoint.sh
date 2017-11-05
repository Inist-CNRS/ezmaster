#!/bin/sh -eux

# cleanup all the instances conf at startup
# because if one instance is not listening, nginx will just not start...
rm -f /etc/nginx/conf.d/*.conf
# copy the last version of the template
cp -f /etc/nginx/ezmaster-instance-nginx.conf.tpl /etc/nginx/conf.d/ 

exec "$@"
