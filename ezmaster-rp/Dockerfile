FROM nginx:1.13.3

# to help docker debugging
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install vim curl

# nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD nginx -g 'daemon off;'
EXPOSE 35267
