# Sergw (Serial Gateway)

Sergw is a serial-to-TCP gateway service that provides bidirectional communication between a serial port (typically containing an antenna or radio device) and multiple TCP clients over a network interface. It enables remote access to the serial device from anywhere on the network.

## What It Does

Sergw acts as a bridge between:
- **Serial port device** (like an antenna, radio, or other serial communication device)
- **Network clients** (web applications, monitoring tools, or other services)

### Core Functionality

1. **Serial Port Management**
   - Connects to USB serial ports (e.g., `/dev/ttyUSB0`)
   - Configurable baud rates (default: 57600)
   - Automatic reconnection with linear backoff (1 second)
   - Robust error handling for connection issues

2. **TCP Server**
   - Listens on configurable host:port (default: `127.0.0.1:5656`)
   - Accepts multiple concurrent TCP connections
   - Broadcasts serial data to all connected clients
   - Forwards client data to the serial port

3. **Data Flow**
   - **Serial → TCP**: All data from the serial port is broadcast to every connected TCP client
   - **TCP → Serial**: Data from any TCP client is queued and sent to the serial port
   - **Buffering**: Outbound messages are buffered when serial port is unavailable

## Use Cases

- **Antenna Communication**: Expose antenna/radio data over the network for monitoring
- **Remote Control**: Allow multiple operators to send commands to the serial device
- **Data Logging**: Enable multiple systems to record communication data simultaneously
- **Network Access**: Control and monitor serial devices from anywhere on the network

## Architecture

```
[Serial Device (Antenna/Radio)] ←→ [Sergw] ←→ [TCP Client 1]
                                           ←→ [TCP Client 2]
                                           ←→ [TCP Client N]
```

### Key Components

- **Serial Manager**: Handles serial port connections, reconnection logic, and data buffering
- **TCP Server**: Manages client connections and data distribution
- **Client Manager**: Tracks active TCP connections and broadcasts data
- **Message Queues**: Buffers outbound messages during connection issues

## Commands

### List Available Ports
```bash
./sergw ports
```
Shows all available USB serial ports on the system.

### Start Gateway
```bash
./sergw listen -serial /dev/ttyUSB0 -baud 57600 -host 0.0.0.0:5656
```

#### Parameters
- `-serial`: Serial port path (required)
- `-baud`: Baud rate (default: 57600)
- `-host`: TCP listen address (default: 127.0.0.1:5656)
- `-verbose`: Enable detailed logging

## Reliability Features

- **Automatic Reconnection**: Attempts to reconnect every 1 second if serial port is disconnected
- **Message Buffering**: Stores up to 256KB of outbound messages during outages
- **Graceful Shutdown**: Handles OS signals and closes connections cleanly
- **Error Recovery**: Continues operation after temporary connection issues
- **Cross-Platform**: Works on Linux, Windows, and macOS

## Integration

Sergw integrates with the RGS (Rocket Ground Station) ecosystem by:
- Providing network access to serial communication devices (like antennas)
- Enabling real-time data streaming to web dashboards
- Supporting multiple monitoring and control applications
- Maintaining reliable communication during operations

## Technical Details

- **Language**: Go 1.25+
- **Serial Library**: go.bug.st/serial for cross-platform support
- **Concurrency**: Goroutines for serial I/O, TCP management, and data forwarding
- **Buffering**: Configurable write buffer limits with drop-oldest policy
- **Logging**: Structured logging with slog for operational visibility