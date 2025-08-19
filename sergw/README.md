# SerGW (Serial Gateway)

A Go-based serial-to-TCP gateway that enables bidirectional communication between a serial device and multiple TCP clients. This tool is particularly useful for exposing serial devices over a network interface, especially in robotics, IoT, and data acquisition applications.

## Features

- List available USB serial ports
- Create a TCP server that bridges serial communication
- Support for multiple concurrent TCP connections
  - Data from serial is broadcast to all TCP clients
  - Data from any TCP client is sent to the serial port
- Automatic handling of connection/disconnection events
- Configurable baud rate and TCP host/port
- Structured logging with slog
- Graceful shutdown handling
- Cross-platform serial port support via go.bug.st/serial

## Prerequisites

- Go 1.25 or later
- Serial port access permissions (e.g., add user to `dialout` group on Linux)

## Installation

1. Clone the repository (if not already done)
2. Build the project:
   ```bash
   go build -o sergw
   ```

## Usage

### List Available Ports

To see all available USB serial ports:

```bash
./sergw ports
```

### Start the Gateway

To start the gateway, specify a serial port and optionally configure baud rate and TCP host:

```bash
./sergw listen -serial /dev/ttyUSB0 -baud 57600 -host 127.0.0.1:5656
```

#### Parameters:
- `-serial`: Path to the serial port (required)
- `-baud`: Baud rate (default: 57600)
- `-host`: TCP host and port to listen on (default: 127.0.0.1:5656)
- `-verbose`: Enable verbose logging (optional)

## How It Works

SerGW creates a TCP server that accepts multiple client connections. When data is received from the specified serial port, it is broadcast to all connected TCP clients. Conversely, data received from any connected TCP client is forwarded to the serial port.

This allows multiple network clients to listen to a single serial device, and allows any of them to send data back to the device.

The application uses multiple goroutines to handle:
- Serial port reading and broadcasting
- TCP connection management
- Forwarding TCP data to the serial port

## Dependencies

SerGW uses the [go.bug.st/serial](https://pkg.go.dev/go.bug.st/serial) library for cross-platform serial port communication. This library provides:
- Better cross-platform support (Linux, Windows, macOS)
- Modern Go API with proper error handling
- USB device enumeration capabilities
- Active maintenance and regular updates

## Error Handling

The application includes error handling for:
- Serial port connection issues
- TCP connection failures
- Data transmission errors
- Client disconnections

## Troubleshooting

### Common Issues

1. **Permission Denied on Serial Port**
   - Ensure you're in the `dialout` group
   - Check if another process is using the port

2. **Connection Timeouts**
   - Verify the serial port is correct
   - Check baud rate settings
   - Ensure the device is powered and connected

3. **TCP Connection Issues**
   - Verify the host and port are not in use
   - Ensure the port is accessible
