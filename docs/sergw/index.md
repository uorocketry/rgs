# Sergw (Serial Gateway)

Serial-to-TCP gateway providing bidirectional communication between serial ports and multiple TCP clients.

## Overview

Bridges serial devices (antennas, radios) with network clients, enabling remote access and multi-client monitoring.

```
[Serial Device] ←→ [Sergw] ←→ [TCP Client 1]
                          ←→ [TCP Client 2]
                          ←→ [TCP Client N]
```

## Features

- **Serial Port Management**: USB serial support, configurable baud rates (default: 57600), automatic reconnection (1s interval)
- **TCP Server**: Multiple concurrent connections, broadcasts serial data to all clients, forwards client data to serial port
- **Data Buffering**: 256KB outbound buffer with drop-oldest policy during disconnections
- **Cross-Platform**: Linux, Windows, macOS

## Usage

### List Available Ports
```bash
./sergw ports
```

### Start Gateway
```bash
./sergw listen --serial /dev/ttyUSB0 --baud 57600 --host 0.0.0.0:5656
```

**Parameters:**
- `--serial`: Serial port path (required)
- `--baud`: Baud rate (default: 57600)
- `--host`: TCP listen address (default: 127.0.0.1:5656)
- `--verbose`: Enable detailed logging

## Technical Details

- **Language**: Go 1.25+
- **Serial Library**: go.bug.st/serial
- **Concurrency**: Goroutines for serial I/O and TCP management
- **Logging**: Structured logging with slog