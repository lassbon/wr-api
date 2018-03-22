FROM node:7.7.0

# create the log directory
RUN mkdir -p /var/log/applications/progo

# Creating base "src" directory where the source repo will reside in our container.
# Code is copied from the host machine to this "src" folder in the container as a last step.
RUN mkdir /src
WORKDIR /src

# Copy from cache unless the package.json file has changed
COPY ./package.json /src

# Install node dependencies
RUN npm install

# Install global npm dependencies
RUN npm install nodemon knex jshint jscs -g

# Copy entire file to docker
COPY . /src

# Map a volume for the log files and add a volume to override the code
VOLUME ["/src", "/var/log/applications/progo"]

# Expose web service
EXPOSE  8080


CMD ["sh", "-c", "npm start"]