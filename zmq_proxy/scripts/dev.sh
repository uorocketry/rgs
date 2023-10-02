#!/bin/bash

cleanup() {
    kill $CARGO_PID
    echo "Killed 'cargo run' process"
}

trap cleanup EXIT

XPUB_PORT=${XPUB_PORT:-3002}
XSUB_PORT=${XSUB_PORT:-3003}

# Start 'cargo run' and save its PID
cargo run -- -p $XPUB_PORT -s $XSUB_PORT &
CARGO_PID=$!

# Forever loop to watch for changes in the 'src' folder
while true; do
    inotifywait -r -e modify ./src

    # Kill the previous 'cargo run' process
    kill $CARGO_PID

    clear

    # Run 'cargo run' again and save its new PID
    cargo run -- -p $XPUB_PORT -s $XSUB_PORT &
    CARGO_PID=$!
done
