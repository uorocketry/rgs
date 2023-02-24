FROM node:lts

WORKDIR /app

RUN apt-get update
RUN apt-get install -y \
    curl \
    git \
    # Install dev dependencies
    build-essential \
    pkg-config \
    libudev-dev
# Also install node and pnpm for the dev server
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install
CMD pnpm install && pnpm dev
