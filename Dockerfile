FROM ubuntu:latest

WORKDIR /app


COPY target/x86_64-unknown-linux-musl/release/hydra_message_store /usr/local/bin/hydra_message_store
COPY target/x86_64-unknown-linux-musl/release/hydra_command_dispatcher /usr/local/bin/hydra_command_dispatcher
COPY target/x86_64-unknown-linux-musl/release/hydrate /usr/local/bin/hydrate
COPY target/x86_64-unknown-linux-musl/release/hydrand /usr/local/bin/hydrand


# Run an interactive shell so we can poke around more easily
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]

