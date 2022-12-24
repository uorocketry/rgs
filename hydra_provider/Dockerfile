FROM rust:latest as builder
WORKDIR /usr/src/hydra
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
COPY --from=builder /usr/local/cargo/bin/hydra_provider /usr/local/bin/hydra_provider
CMD ["hydra_provider"]
