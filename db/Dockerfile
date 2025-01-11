FROM node:20-alpine as base
RUN apk --update add postgresql-client

FROM base as dev
WORKDIR /app

COPY ./schema/ ./schema/
COPY ./scripts/ ./scripts/
COPY ./package.json ./package.json
COPY ./drizzle.config.js ./drizzle.config.js

RUN npm install