FROM node:4.4.0

# install the docker and docker-compose client inside this image
# ezmaster uses it to manage the app instances
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 1.12.1
ENV DOCKER_SHA256 893e3c6e89c0cd2c5f1e51ea41bc2dd97f5e791fcfa3cee28445df277836339d
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

# Run the test to make sure
# the docker image will be ok.
# If the test fails, the image
# will not be built
RUN npm config set strict-ssl false \
    # npm install -q && \
    # npm test && \
    # Then just install
    # production node modules
    rm -rf ./node_modules && \
    npm install -q --production && \
    npm cache clean

# instances and manifests folders are a volume
# because they will for example contains the user's
# data files (ex: CSV)
VOLUME /app/instances
VOLUME /app/manifests

# run the application
CMD ["npm", "start"]
EXPOSE 35267
