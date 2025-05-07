# Heartbeat Service

Periodically queues a "Ping" command in the RGS database and reports its own health.

## Features

- Connects to a LibSQL database.
- Periodically queues a "Ping" command into the `OutgoingCommand` table for the `command-dispatcher`.
- Periodically inserts its own health status into the `ServicePing` table.
- Configurable interval for queuing Ping commands.

## Prerequisites

- RGS LibSQL database (with `OutgoingCommand` and `ServicePing` tables) accessible.

## Usage

### Running the Service

```sh
# From the rgs workspace root
cargo run -p heartbeat -- [options]
# Or directly if built:
# ./target/debug/heartbeat [options]
```

### Parameters

| Parameter             | Description                                                              | Default                 |
|-----------------------|--------------------------------------------------------------------------|-------------------------|
| `--libsql-url`        | LibSQL database URL (e.g., `http://localhost:8080`, `file:/path/db.sqlite`) |                         |
| `--libsql-auth-token` | Optional auth token for remote LibSQL DB                                   | *empty*                 |
| `--interval-secs`     | Interval (seconds) for queuing Ping commands                             | 10                      |

## Operational Details

- **Ping Command Queuing**: Every `--interval-secs`, a new "Ping" command is inserted into `OutgoingCommand` with status "Pending" and `source_service` set to "heartbeat".
- **Health Pinging**: Every 30 seconds (hardcoded), a record is inserted into `ServicePing` with `service_id` as "heartbeat" and the current hostname.
