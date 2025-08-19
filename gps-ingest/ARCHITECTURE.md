# GPS Ingest Architecture

## Overview

The `gps-ingest` program is designed to be a simple, focused component in a larger data processing pipeline. It extracts the latest GPS coordinates and altitude data from the RGS database and outputs them in JSON format, making it easy to pipe to other programs.

## System Architecture

This program is designed to fit into the antenna tracker architecture shown in the system diagram:

```
GPS Stream (Rust) → Predictor (Python) → Antenna Tracker API
     ↓                    ↓                    ↓
gps-ingest         example_pipeline.py    (External System)
```

### Component Roles

1. **GPS Stream (gps-ingest)**
   - **Language**: Rust
   - **Input**: SQLite database queries
   - **Output**: JSON to stdout
   - **Purpose**: Extract and format latest GPS/altitude data

2. **Predictor (example_pipeline.py)**
   - **Language**: Python
   - **Input**: JSON from gps-ingest (via pipe)
   - **Output**: Prediction commands
   - **Purpose**: Process GPS data and predict future positions

3. **Antenna Tracker API**
   - **Language**: Python library
   - **Input**: Commands from predictor
   - **Output**: Hardware control signals
   - **Purpose**: Control antenna positioning hardware

## Data Flow

```
Database → gps-ingest → JSON → Python Script → Predictions → API Commands
```

### Database Schema

The program queries two main tables:

- **SbgGpsPos**: GPS position data (lat/lon/alt/accuracy)
- **SbgAir**: Altitude and atmospheric data

### JSON Output Format

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

## Usage Patterns

### Basic Usage
```bash
# Get latest GPS data
cargo run -p gps-ingest

# Get multiple records
cargo run -p gps-ingest -- --limit 5
```

### Piping to Other Programs
```bash
# Extract just latitude
cargo run -p gps-ingest | jq -r '.gps[0].latitude'

# Format coordinates
cargo run -p gps-ingest | jq -r '.gps[0] | "\(.latitude),\(.longitude),\(.altitude)"'

# Check data freshness
cargo run -p gps-ingest | jq -r '.gps[0] | if (.timestamp_epoch // 0) > (now - 3600) then "Recent" else "Stale" end'
```

### Integration with Python
```python
import subprocess
import json

# Run gps-ingest and capture output
result = subprocess.run(
    ["cargo", "run", "-p", "gps-ingest"],
    capture_output=True,
    text=True
)

# Parse JSON output
data = json.loads(result.stdout)
gps_data = data['gps'][0]
print(f"Position: {gps_data['latitude']}, {gps_data['longitude']}")
```

## Design Principles

1. **Single Responsibility**: Only extracts GPS data, doesn't process it
2. **Unix Philosophy**: Does one thing well, outputs to stdout
3. **JSON Output**: Structured, parseable format for easy integration
4. **Configurable**: Database path and record limit can be specified
5. **Error Handling**: Graceful degradation when data is unavailable
6. **Performance**: Fast database queries with proper indexing

## Future Enhancements

- **Real-time Mode**: Continuous output with `--watch` flag
- **Data Filtering**: Time range and quality filters
- **Multiple Formats**: CSV, XML, or binary output options
- **WebSocket Output**: Real-time streaming over network
- **Data Validation**: Quality checks and outlier detection
- **Caching**: In-memory caching for frequently accessed data

## Dependencies

- **libsql**: Modern SQLite interface with async support
- **serde**: JSON serialization/deserialization
- **tokio**: Async runtime for database operations
- **clap**: Command-line argument parsing
- **chrono**: Timestamp handling and formatting

## Building and Testing

```bash
# Build the project
make build

# Check compilation
make check

# Run tests
make test

# Test piping examples
make test-pipe

# Run example pipeline
make example
```

## Integration Notes

- The program is designed to be lightweight and fast
- JSON output is optimized for parsing by other tools
- Error conditions are handled gracefully
- The program can be easily integrated into CI/CD pipelines
- Database connections are properly managed and closed


