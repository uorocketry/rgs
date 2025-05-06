# SerGW (Serial Gateway)

A Rust-based serial-to-TCP gateway that enables bidirectional communication between a serial device and multiple TCP clients. This tool is particularly useful for exposing serial devices over a network interface, especially in robotics, IoT, and data acquisition applications.

## Features

- List available USB serial ports
- Create a TCP server that bridges serial communication
- Support for multiple concurrent TCP connections
  - Data from serial is broadcast to all TCP clients
  - Data from any TCP client is sent to the serial port
- Automatic handling of connection/disconnection events
- Configurable baud rate and TCP host/port

## Prerequisites

- Rust toolchain (install via [rustup](https://rustup.rs/))
- Serial port access permissions (e.g., add user to `dialout` group on Linux)

## Installation

1. Clone the repository (if not already done)
2. Build the project:
   ```bash
   cargo build --release
   ```
   The binary will be at `target/release/sergw`.

## Usage

### List Available Ports

To see all available USB serial ports:

```bash
./sergw ports
```

### Start the Gateway

To start the gateway, specify a serial port and optionally configure baud rate and TCP host:

```bash
./sergw listen --serial /dev/ttyUSB0 --baud 57600 --host 127.0.0.1:5656
```

#### Parameters:
- `--serial`: Path to the serial port (required)
- `--baud`: Baud rate (default: 57600)
- `--host`: TCP host and port to listen on (default: 127.0.0.1:5656)

## How It Works

SerGW creates a TCP server that accepts multiple client connections. When data is received from the specified serial port, it is broadcast to all connected TCP clients. Conversely, data received from any connected TCP client is forwarded to the serial port.

This allows multiple network clients to listen to a single serial device, and allows any of them to send data back to the device.

The application uses multiple threads to handle:
- Serial port reading and broadcasting
- TCP connection management
- Forwarding TCP data to the serial port

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
