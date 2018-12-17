FROM node:8
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
