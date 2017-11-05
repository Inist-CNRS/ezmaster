FROM node:8.9.0

# install the docker and docker-compose client inside this image
# ezmaster uses it to manage the app instances
# (to upgrade see https://hub.docker.com/_/docker/)
ENV DOCKER_VERSION 17.09.0-ce
ENV DOCKER_SHA256 a9e90a73c3cdfbf238f148e1ec0eaff5eb181f92f35bdd938fd7dab18e1c4647
RUN set -x \
  && curl -fL -o docker.tgz "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz" \
  && echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - \
  && tar -xzvf docker.tgz \
  && mv docker/* /usr/local/bin/ \
  && rmdir docker \
  && rm docker.tgz \
  && docker -v

# install npm dependencies
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install


# copy the code source of ezmaster 
# after dependencies installation
COPY . /app

# instances, manifests and applications folders are volumes
# because these data should be persistent
VOLUME /app/data/instances
VOLUME /app/data/manifests
VOLUME /app/data/applications

# run the application
CMD ["npm", "start"]
EXPOSE 35269
