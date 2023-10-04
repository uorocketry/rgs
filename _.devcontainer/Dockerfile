FROM rustlang/rust:nightly

# Install dependencies
RUN apt-get update
RUN apt-get install -y \
    curl \
    git \
    cmake \
    pkg-config \
    libudev-dev

# Also install node and pnpm for the dev server
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash
RUN apt-get install -y nodejs
RUN npm install -g pnpm
RUN npm install -g pm2
