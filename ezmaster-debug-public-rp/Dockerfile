FROM httpd:2.4.29

# vim for debug
RUN echo "deb http://archive.debian.org/debian jessie main" > /etc/apt/sources.list; \
    echo "deb http://security.debian.org jessie/updates main" >> /etc/apt/sources.list; \
    echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/backports.list
RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -yq --no-install-recommends vim

COPY entrypoint.sh /
COPY httpd-vhosts.conf /usr/local/apache2/conf/extra/

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "httpd-foreground" ]
EXPOSE 80