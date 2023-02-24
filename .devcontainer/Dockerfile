FROM rustlang/rust:nightly

# Install dependencies
RUN apt-get update
RUN apt-get install -y \
    curl \
    git \
    cmake \
    pkg-config \
    libczmq-dev \
    libudev-dev
# Also install node and pnpm for the dev server
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash
RUN apt-get install -y nodejs
RUN npm install -g pnpm


# Clean environment 
RUN rm -rf ./.pnpm-store ./rgs-web/node_modules ./rgs-web/.pnpm-lock.yaml ./rgs-web/.svelte-kit
RUN rm -rf ./hydra_provider/target ./hydra_provider/Cargo.lock

