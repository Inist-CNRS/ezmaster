FROM ubuntu:16.04

RUN apt-get update \
 && apt-get install -yq --no-install-recommends nginx-extras gosu apache2-utils \
 && rm -rf /var/lib/apt/lists/*

RUN chmod go+rwX -R /var /run

COPY entrypoint.sh /
COPY nginx.conf /etc/nginx/nginx.conf.orig

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]