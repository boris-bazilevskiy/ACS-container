# syntax=docker/dockerfile:1
FROM alpine:latest
RUN apk update &&\
    apk upgrade &&\
    apk add nodejs npm &&\
    chown -R root:root /home
# Install app dependencies
WORKDIR /App
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1234
CMD [ "npm", "start" ]