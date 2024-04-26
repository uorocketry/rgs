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
# Run on port 3001
cargo run -- -p 3001
```

This project uses SQLX to type check SQL queries. If by any reason you need to work with the database offline, you can first run `cargo sqlx prepare` with the database running. Alternativelly, you can set a `SQLX_OFFLINE` environment variable to `true`.

```bash
cargo sqlx prepare
SQLX_OFFLINE=true cargo build
```
