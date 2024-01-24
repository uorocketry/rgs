FROM node:current-alpine
WORKDIR /app

COPY ./dump/ ./dump/
COPY ./schema/ ./schema/
COPY ./bootstrap.sh ./bootstrap.sh
COPY ./restore_hasura.sh ./restore_hasura.sh
COPY ./package.json ./package.json
COPY ./drizzle.config.ts ./drizzle.config.ts

RUN npm install
RUN apk --update add postgresql-client