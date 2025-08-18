#!/bin/bash

# Test script to demonstrate piping gps-ingest output to other programs

echo "=== Testing gps-ingest with pipe examples ==="
echo

echo "1. Basic output:"
cargo run -p gps-ingest
echo

echo "2. Extract just the latitude from the first GPS record:"
cargo run -p gps-ingest | jq -r '.gps[0].latitude // "No GPS data"'
echo

echo "3. Extract altitude and format nicely:"
cargo run -p gps-ingest | jq -r '.altitude[0] | "Altitude: \(.altitude // "Unknown")m, Pressure: \(.pressure_abs // "Unknown")hPa"'
echo

echo "4. Get coordinates in a simple format:"
cargo run -p gps-ingest | jq -r '.gps[0] | "\(.latitude // "N/A"),\(.longitude // "N/A"),\(.altitude // "N/A")"'
echo

echo "5. Check if we have recent data (within last hour):"
cargo run -p gps-ingest | jq -r '.gps[0] | if (.timestamp_epoch // 0) > (now - 3600) then "Recent data available" else "Data may be stale" end'
echo

echo "=== Test complete ==="
