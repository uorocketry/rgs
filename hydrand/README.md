# Hydrand

A test message generator that simulates Hydra Gateway by sending random MAVLink messages over TCP.

## Features

- Generates random MAVLink messages
- Sends messages over TCP
- Configurable message interval
- Automatic heartbeat monitoring

## Prerequisites

- LibSQL server up and running
- Network access for TCP connections

## Usage

```bash
./hydrand [options]
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--address` | TCP server address | 127.0.0.1 |
| `--port` | TCP server port | 5656 |
| `--interval` | Message interval (ms) | 100 |
| `--libsql-url` | LibSQL server URL | http://localhost:8080 |

## Implementation

- Sends random MAVLink messages
- Heartbeat: Every 30 seconds
- Supports multiple concurrent connections
- Sequential message numbering