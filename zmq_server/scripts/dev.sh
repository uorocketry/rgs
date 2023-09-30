#!/bin/bash

cleanup() {
    kill $CARGO_PID
    echo "Killed 'cargo run' process"
}

trap cleanup EXIT

ZMQ_PORT=${ZMQ_PORT:-3002}

# Start 'cargo run' and save its PID
cargo run -- -z $ZMQ_PORT &
CARGO_PID=$!

# Forever loop to watch for changes in the 'src' folder
while true; do
    inotifywait -r -e modify ./src

    # Kill the previous 'cargo run' process
    kill $CARGO_PID

    clear

    # Run 'cargo run' again and save its new PID
    cargo run -- -z $ZMQ_PORT &
    CARGO_PID=$!
done
