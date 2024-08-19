FROM rust:latest as builder

WORKDIR /usr/src/app
COPY . . 
RUN SQLX_OFFLINE=true cargo build --release 

# Stage 2: Create a smaller image with the binary
FROM debian:buster-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/target/release/hydra_pg .

# Set the entrypoint to the binary
ENTRYPOINT ["./hydra_pg"]