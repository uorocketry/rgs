FROM ubuntu:latest

RUN apt update
RUN apt install -y curl build-essential git pkg-config libudev-dev
# Install Node
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash
RUN apt-get install -y nodejs
RUN npm install -g pnpm
# Run install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal --default-toolchain nightly 
RUN . "$HOME/.cargo/env"