FROM ubuntu:14.04

# Install Node.js
RUN apt-get update
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_10.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

# Create a directory (to house our source files) and navigate to it.
WORKDIR /src
# Copy everything in the host folder into the working folder of the container.
COPY ./package.json ./package-lock.json /src/
COPY ./src /src/
# Install app dependencies
RUN npm install
# Installing python
RUN apt-get install python2.7
RUN set -xe \
    && apt-get update \
    && apt-get install --yes python-pip
# Installing platformio
RUN pip install -U platformio

