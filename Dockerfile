FROM node:4.4.0

# install the docker and docker-compose client inside this image
# ezmaster uses it to manage the app instances
# (to upgrade see https://hub.docker.com/_/docker/)
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 1.12.0
ENV DOCKER_SHA256 3dd07f65ea4a7b4c8829f311ab0213bca9ac551b5b24706f3e79a97e22097f8b
RUN set -x \
  && curl -fSL "https://${DOCKER_BUCKET}/builds/Linux/x86_64/docker-$DOCKER_VERSION.tgz" -o docker.tgz \
  && echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - \
  && tar -xzvf docker.tgz \
  && mv docker/* /usr/local/bin/ \
  && rmdir docker \
  && rm docker.tgz \
  && docker -v

# copy the code source of ezmaster and tells this folder
# must be the basedir when running ezmaster
COPY . /app
WORKDIR /app

# install ezmaster npm dependancies
# build bundle.js and bundle.css
RUN npm config set strict-ssl false \
    npm install -q && \
    npm run build && \
    rm -rf ./node_modules && \
    npm install -q --production && \
    npm cache clean

# instances, manifests and applications folders are volumes
# because these data should be persistent
VOLUME /app/data/instances
VOLUME /app/data/manifests
VOLUME /app/data/applications

# run the application
CMD ["npm", "start"]
EXPOSE 35267
