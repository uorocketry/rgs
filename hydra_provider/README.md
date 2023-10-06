# Hydra Provider

## Build and run

```bash
# Install Rust
xdg-open https://www.rust-lang.org/tools/install
# Install Dependencies
sudo apt install libudev-dev
# Build
cargo build
# Run on port 3003 with random input
cargo run -- -r -z 3003
# Run on port 3003 with serial input
cargo run -- -z 3003
# Use "cargo run -- --help" for more options
```
