#!/bin/bash

cleanup() {
    kill $PID
    echo "Killed 'go process' with PID $PID"
}

trap cleanup EXIT

# Start 'go run ./src/main.go' and save its PID
go run ./src/main.go serve &
PID=$!
sleep 1

# Forever loop to watch for changes in the 'src' folder

while true; do
    inotifywait -r -e modify ./src

    # Kill the previous 'cargo run' process
    kill $PID

    sleep 1

    clear

    # Restart the program
    go run ./src/main.go serve &
    PID=$!
done
