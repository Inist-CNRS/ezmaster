FROM httpd:2.4.39

# vim for debug
RUN apt-get update && apt-get install -yq --no-install-recommends vim

COPY entrypoint.sh /
COPY httpd-vhosts.conf /usr/local/apache2/conf/extra/

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "httpd-foreground" ]
EXPOSE 80
