# Hydra Provider

Hydra Provider is a server that listens to the Hydra Rocket's radio messages via a serial port and broadcasts the data to the rest of the infrastructure.

## Requirements

- Make sure you have [Rust](https://www.rust-lang.org/tools/install) installed
- This project also requires: `libudev-dev` or the equivalent for your system.

## Build and run

```bash
# Install Rust
xdg-open https://www.rust-lang.org/tools/install
# Install Dependencies
sudo apt install libudev-dev
# Build
cargo build
# Run on port 3001 with random input
cargo run -- -r -p 3001
# Run on port 3001 with serial input
cargo run -- -p 3001
# Use "cargo run -- --help" for more options
```

This project uses SQLX to type check SQL queries. To build this project without the database running you can add a `SQLX_OFFLINE=tru` environment variable 

```bash
SQLX_OFFLINE=true cargo build
```
