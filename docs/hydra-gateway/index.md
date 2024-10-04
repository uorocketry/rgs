# Hydra Gateway

Hydra Gateway is a service that provides unfiltered I/O access to the rocket via a serial connection.

It is designed to be a simple and reliable TCP server that can be used to send and receive data from the rocket.

Messages are broadcasted to all connected clients.

![A](/static/hydra_gate_a.png)

Client messages are sent to the rocket in the order they are received.

![B](/static/hydra_gate_b.png)

## Reliability

More reliability options can be explored in the future, such as:
- Automatic reconnection if serial port is accidentally disconnected
- Storing messages in a to-write queue if the serial port is not available
- HTTP/gRPC control interface for monitoring and control