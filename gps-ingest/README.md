# GPS Ingest

A simple Rust program that extracts the latest GPS coordinates and altitude data from the RGS database and outputs them in JSON format.

## Features

- Queries the latest GPS position data from `SbgGpsPos` table
- Queries the latest altitude data from `SbgAir` table  
- Outputs data in structured JSON format
- Configurable database path and record limit
- Designed to be piped to other programs

## Usage

### Basic usage (defaults to latest 1 record)
```bash
cargo run
```

### Specify database path
```bash
cargo run -- --database /path/to/rgs.db
```

### Get multiple latest records
```bash
cargo run -- --limit 5
```

### Pipe output to another program
```bash
cargo run | jq '.gps[0].latitude'
```

## Command Line Options

- `-d, --database`: Path to the SQLite database file (default: `db/rgs.db`)
- `-l, --limit`: Number of latest GPS records to retrieve (default: 1)
- `-h, --help`: Show help information

## Output Format

The program outputs JSON with the following structure:

```json
{
  "gps": [
    {
      "timestamp": "2024-01-01T12:00:00Z",
      "timestamp_epoch": 1704110400,
      "latitude": 45.123456,
      "longitude": -75.654321,
      "altitude": 100.5,
      "latitude_accuracy": 0.001,
      "longitude_accuracy": 0.001,
      "altitude_accuracy": 0.5,
      "num_sv_used": 8,
      "status": "Valid"
    }
  ],
  "altitude": [
    {
      "timestamp": "1704110400",
      "timestamp_epoch": 1704110400,
      "altitude": 100.5,
      "pressure_abs": 1013.25,
      "pressure_diff": 0.0,
      "true_airspeed": 0.0,
      "air_temperature": 15.0,
      "status": "Valid"
    }
  ],
  "generated_at": "2024-01-01T12:00:00Z"
}
```

## Building

```bash
cargo build --release
```

The binary will be available at `target/release/gps-ingest`.

## Dependencies

- `libsql`: SQLite database access
- `serde` + `serde_json`: JSON serialization
- `chrono`: Timestamp handling
- `tokio`: Async runtime
- `clap`: Command line argument parsing
- `anyhow`: Error handling
