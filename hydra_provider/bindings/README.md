These bindings must be updated manually:

1. Run this command in this directory: `cargo test`
   1. Clone the `hydra` repo locally. Run this command, replacing the target with the appropriate one for your OS: `cargo test -p messages --features ts --target x86_64-unknown-linux-gnu`
2. Copy the content of the `hydra/libraries/messages/bindings` folder here.