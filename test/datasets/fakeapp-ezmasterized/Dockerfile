FROM node:4.4.0

COPY ./app.js      /fakeapp/app.js
COPY ./config.json /fakeapp/config.json
COPY ./data/       /fakeapp/data/

RUN echo '{ \
  "httpPort": 3333, \
  "configPath": "/fakeapp/config.json", \
  "dataPath": "/fakeapp/data/" \
}' > /etc/ezmaster.json

EXPOSE 3333
WORKDIR /fakeapp
CMD node app.js