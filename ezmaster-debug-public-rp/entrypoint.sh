#!/bin/sh -eux

# enable mod_proxy
sed -i 's%^#LoadModule proxy_http_module modules/mod_proxy_http.so%LoadModule proxy_http_module modules/mod_proxy_http.so%g' \
    /usr/local/apache2/conf/httpd.conf
sed -i 's%^#LoadModule proxy_module modules/mod_proxy.so%LoadModule proxy_module modules/mod_proxy.so%g' \
    /usr/local/apache2/conf/httpd.conf
sed -i 's%^#Include conf/extra/httpd-vhosts.conf%Include conf/extra/httpd-vhosts.conf%g' \
    /usr/local/apache2/conf/httpd.conf

# exec the CMD (see Dockerfile)
exec "$@"