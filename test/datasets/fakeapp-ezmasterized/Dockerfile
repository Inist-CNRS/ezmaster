FROM node:4.4.0

COPY ./app.js      /fakeapp/app.js
COPY ./config.json /fakeapp/config.json
COPY ./data/       /fakeapp/data/

RUN echo '{ \
  "port": 3333, \
  "config": "/fakeapp/config.json", \
  "data": "/fakeapp/data/" \
}' > /etc/ezmaster.json

EXPOSE 3333
WORKDIR /fakeapp
CMD node app.js