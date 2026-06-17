# syntax=docker/dockerfile:1
# Multi-arch: build with --platform linux/amd64,linux/arm64
# Runs on Linux hosts and Windows Docker Desktop (Linux containers mode)
FROM node:lts-alpine
RUN apk update && apk upgrade --no-cache
WORKDIR /App
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 1234
CMD ["npm", "start"]
