FROM node:current-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN apk --update add postgresql-client