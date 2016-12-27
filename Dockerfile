FROM node:6.9.1

# install the docker and docker-compose client inside this image
# ezmaster uses it to manage the app instances
# (to upgrade see https://hub.docker.com/_/docker/)
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 1.12.3
ENV DOCKER_SHA256 626601deb41d9706ac98da23f673af6c0d4631c4d194a677a9a1a07d7219fa0f
RUN set -x \
  && curl -fSL "https://${DOCKER_BUCKET}/builds/Linux/x86_64/docker-$DOCKER_VERSION.tgz" -o docker.tgz \
  && echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - \
  && tar -xzvf docker.tgz \
  && mv docker/* /usr/local/bin/ \
  && rmdir docker \
  && rm docker.tgz \
  && docker -v

# install yarn (faster than npm...)
RUN npm config set strict-ssl false
RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

# install npm dependencies
WORKDIR /app
COPY ./package.json /app/package.json
RUN yarn install && yarn cache clean


# copy the code source of ezmaster 
# after dependencies installation
COPY . /app
RUN npm run build

# instances, manifests and applications folders are volumes
# because these data should be persistent
VOLUME /app/data/instances
VOLUME /app/data/manifests
VOLUME /app/data/applications

# run the application
CMD ["npm", "start"]
EXPOSE 35267
