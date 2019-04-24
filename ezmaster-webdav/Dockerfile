FROM httpd:2.4.39

# vim for debug
# apache2-utils for htpasswd tool
RUN apt-get update && apt-get install -yq --no-install-recommends vim apache2-utils

COPY entrypoint.sh /
COPY httpd-dav.conf.orig /usr/local/apache2/conf/extra/httpd-dav.conf.orig

# webdav logs
RUN mkdir -p /var/lib/apache2/
RUN touch /var/lib/apache2/access.log /var/lib/apache2/error.log

# webdav lock file and data folder 
RUN mkdir -p /usr/local/apache2/var/
RUN chmod ugo+rwx /usr/local/apache2/var/
RUN chmod -R ugo+rwx /usr/local/apache2/htdocs/

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "httpd-foreground" ]
EXPOSE 35270
