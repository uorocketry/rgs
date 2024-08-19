FROM ubuntu:latest

WORKDIR /app


COPY target/x86_64-unknown-linux-musl/release/hydra_pg /usr/local/bin/hydra_pg
COPY target/x86_64-unknown-linux-musl/release/hydra_commander /usr/local/bin/hydra_commander
COPY target/x86_64-unknown-linux-musl/release/hydrate /usr/local/bin/hydrate
COPY target/x86_64-unknown-linux-musl/release/hydrand /usr/local/bin/hydrand


# Run an interactive shell so we can poke around more easily
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]

