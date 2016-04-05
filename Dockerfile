FROM node:4.4.0

# Copy the local code source
# and tell docker this folder 
# must be used when running a
# container. 
COPY . /app
WORKDIR /app

# Run the test to make sure 
# the docker image will be ok.
# If the test fails, the image 
# will not be built
RUN npm install && \
    npm test && \
    # Then just install 
    # production node modules
    rm -rf ./node_modules && \
    npm install --production && \
    npm cache clean

# data folder is a volume because it will
# contains the user's data files (ex: CSV)
VOLUME /app/data

# run the application
CMD ["npm", "start"]
EXPOSE 3000