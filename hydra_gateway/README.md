# Hydra Gateway

A simple gateway that forwards data from a serial port to a TCP socket and vice versa.

Make sure you have the `dialout` and `tty` user permissions before running.

You can add the to your user group by running

```cmd
sudo usermod -a -G dialout $USER
sudo usermod -a -G tty $USER
```

## Commands

- ports: Prints the list of serial ports available on the system.
- listen: Starts the gateway and listens for incoming connections.
- help: Prints the list of available commands.

## Simple Connection Test

You can test the connection to the gateway by running the following command:

```cmd
nc -v 127.0.0.1 5656
```