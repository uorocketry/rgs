# Rust

To install Rust you can use the following command:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

For `hydra_provider` in specific, if you're on Linux, you might need to install `libudev`:

```sh
sudo apt update && sudo apt install -y libudev-dev
```

Try running `hydra_provider` to see if everything is working:

::: tip

Note that the database must be running for it to run successfully (see [Docker](/guide/requirements/docker)).

:::

```sh
cargo run -- -r -p 3001
```

You should see something like this:

```sh
[... INFO  hydra_provider] Hydra Provider listening on [::1]:301
[... INFO  hydra_provider] Connecting to database...
[... INFO  hydra_provider] Connected to database
[... INFO  hydra_provider] Using random input
```
