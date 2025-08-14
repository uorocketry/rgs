package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const SERVICE_ID = "sergw"

type Args struct {
	Command string
	Serial  string
	Baud    int
	Host    string
	Verbose bool
}

func parseArgs() Args {
	var a Args

	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}
	a.Command = os.Args[1]

	fs := flag.NewFlagSet(a.Command, flag.ExitOnError)
	switch a.Command {
	case "ports":
		// no flags
	case "listen":
		fs.StringVar(&a.Serial, "serial", "", "Serial port path (required)")
		fs.IntVar(&a.Baud, "baud", 57600, "Baud rate")
		fs.StringVar(&a.Host, "host", "127.0.0.1:5656", "TCP host:port to listen on")
		fs.BoolVar(&a.Verbose, "verbose", false, "Verbose logging")
		_ = fs.Parse(os.Args[2:])
		if a.Serial == "" {
			slog.Error("Serial port is required for listen command")
			fs.Usage()
			os.Exit(2)
		}
	default:
		printUsage()
		os.Exit(2)
	}
	return a
}

func printUsage() {
	fmt.Fprintf(os.Stderr, "Usage: %s <command> [options]\n\n", os.Args[0])
	fmt.Fprintf(os.Stderr, "Commands:\n")
	fmt.Fprintf(os.Stderr, "  ports                List available serial ports\n")
	fmt.Fprintf(os.Stderr, "  listen [options]     Start the serial-to-TCP gateway\n\n")
	fmt.Fprintf(os.Stderr, "Listen options:\n")
	fmt.Fprintf(os.Stderr, "  -serial string       Serial port path (required)\n")
	fmt.Fprintf(os.Stderr, "  -baud int            Baud rate (default 57600)\n")
	fmt.Fprintf(os.Stderr, "  -host string         TCP host and port (default \"127.0.0.1:5656\")\n")
	fmt.Fprintf(os.Stderr, "  -verbose             Enable verbose logging\n")
}

func main() {
	// Setup structured logging
	level := slog.LevelInfo
	h := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: level})
	slog.SetDefault(slog.New(h))

	args := parseArgs()
	slog.Info("SerGW starting", "service_id", SERVICE_ID, "command", args.Command)

	switch args.Command {
	case "ports":
		if err := List(); err != nil {
			slog.Error("Failed to list ports", "error", err)
			os.Exit(1)
		}
	case "listen":
		if err := runListen(args); err != nil {
			slog.Error("Gateway terminated", "error", err)
			os.Exit(1)
		}
	}
}

func runListen(a Args) error {
	// Context with OS signals
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	// Shared state for TCP connections
	clients := NewClients(a.Verbose)

	// Serial manager: robust reconnect + buffered writes
	sm := New(Config{
		Port:              a.Serial,
		Baud:              a.Baud,
		ReadTimeout:       2 * time.Second,
		ReconnectBase:     200 * time.Millisecond,
		ReconnectMax:      2 * time.Second,
		WriteBufferLimit:  256 * 1024, // bytes buffered while unplugged
		Verbose:           a.Verbose,
	}, func(b []byte) {
		clients.Broadcast(b) // serial→TCP
	})
	go sm.Run(ctx)

	slog.Info("Starting serial-to-TCP gateway",
		"serial_port", a.Serial,
		"baud_rate", a.Baud,
		"tcp_host", a.Host,
		"verbose", a.Verbose)

	// TCP server (each client: TCP→serial via sm.Outbound)
	return Serve(ctx, a.Host, clients, sm.Outbound(), a.Verbose)
}
