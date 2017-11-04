# build the vuejs app
FROM node:8.4.0 as build-deps
WORKDIR /app/
COPY ./package.json /app/
RUN npm install
COPY . /app
RUN npm run build

# -------------------

# use the ngnix server to serve the built stuff
FROM nginx:1.13.3

# to help docker debugging
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install vim curl gnupg2

# nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build-deps /app/public/dist /app/public/dist
COPY --from=build-deps /app/public/img  /app/public/img
COPY --from=build-deps /app/public/libs /app/public/libs
COPY --from=build-deps /app/public/index.html  /app/public/index.html
COPY --from=build-deps /app/public/favicon.ico /app/public/favicon.ico

CMD nginx -g 'daemon off;'
EXPOSE 35268
