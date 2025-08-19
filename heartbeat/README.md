# Heartbeat Service

A Go service that provides heartbeat functionality for the RGS (Rocket Ground Station) system. The service periodically sends health pings and queues commands while providing comprehensive OpenTelemetry tracing.

## Features

- **Service Health Monitoring**: Periodically sends health pings to the database
- **Command Queuing**: Queues outgoing commands for other services
- **OpenTelemetry Tracing**: Comprehensive distributed tracing for observability
- **Database Integration**: Uses LibSQL for data persistence
- **Configurable Intervals**: Adjustable ping and command queue intervals

## OpenTelemetry Integration

The service is instrumented with OpenTelemetry tracing to provide visibility into:

- Service startup and initialization
- Database connection lifecycle
- Health ping cycles
- Command queue operations
- Error conditions and failures

### Trace Spans

The service creates the following trace spans:

- `heartbeat.service.startup` - Service initialization
- `heartbeat.service_ping.startup` - Health ping task startup
- `heartbeat.service_ping.cycle` - Individual health ping cycles
- `heartbeat.service_ping.db_insert` - Database insert operations for health pings
- `heartbeat.command_queue.startup` - Command queue loop startup
- `heartbeat.command_queue.cycle` - Individual command queue cycles
- `heartbeat.command_queue.db_insert` - Database insert operations for commands

### Attributes

Each span includes relevant attributes such as:
- Service ID and version
- Database URL and connection status
- Hostname and timestamps
- Command types and status
- Database operation results

## Configuration

The service accepts the following command-line arguments:

- `-libsql-url`: LibSQL database URL (required)
- `-libsql-auth-token`: Optional LibSQL authentication token
- `-interval-secs`: Interval in seconds for queuing Ping commands (default: 10)

## Usage

```bash
# Basic usage with required database URL
./heartbeat -libsql-url="libsql://host.turso.io"

# With authentication token
./heartbeat -libsql-url="libsql://host.turso.io" -libsql-auth-token="your-token"

# Custom command queue interval
./heartbeat -libsql-url="libsql://host.turso.io" -interval-secs=30
```

## Development

### Prerequisites

- Go 1.25 or later
- LibSQL database access

### Building

```bash
go build
```

### Testing

```bash
go test -v
```

### Dependencies

The service uses the following key dependencies:

- `go.opentelemetry.io/otel` - OpenTelemetry core
- `go.opentelemetry.io/otel/sdk` - OpenTelemetry SDK
- `go.opentelemetry.io/otel/exporters/stdout/stdouttrace` - Console trace exporter
- `github.com/tursodatabase/libsql-client-go` - LibSQL database driver

## Architecture

The service runs two main goroutines:

1. **Health Ping Task**: Runs every 30 seconds, opens a fresh database connection, inserts a health ping record, and closes the connection.

2. **Command Queue Loop**: Runs at the configured interval (default 10 seconds), inserts "Ping" commands into the OutgoingCommand table.

Both operations are fully traced with OpenTelemetry, providing visibility into the service's behavior and performance.

## Observability

With OpenTelemetry tracing enabled, you can:

- Monitor service performance and latency
- Track database operation success/failure rates
- Identify bottlenecks in health ping or command queue operations
- Correlate errors across distributed operations
- Export traces to various backends (Jaeger, Zipkin, etc.)

## Future Enhancements

- Configurable health ping intervals
- Multiple command types support
- Metrics collection with OpenTelemetry
- Structured logging with trace correlation
- Health check endpoints
- Graceful shutdown handling
