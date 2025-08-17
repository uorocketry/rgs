package main

import (
	"context"
	"database/sql"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"time"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

const SERVICE_ID = "heartbeat"

type Args struct {
	LibsqlURL       string
	LibsqlAuthToken string
	IntervalSecs    uint64
}

func parseArgs() Args {
	var a Args
	flag.StringVar(&a.LibsqlURL, "libsql-url", "", "LibSQL database URL (e.g. libsql://host.turso.io)")
	flag.StringVar(&a.LibsqlAuthToken, "libsql-auth-token", "", "Optional LibSQL auth token")
	flag.Uint64Var(&a.IntervalSecs, "interval-secs", 10, "Interval (seconds) for queuing Ping commands")
	flag.Parse()
	return a
}

func buildRemoteURL(url, token string) (string, error) {
	if url == "" {
		return "", errors.New("libsql-url is required")
	}
	// libSQL remote driver expects the token as ?authToken=... in the URL.
	// Docs example: libsql://[DATABASE].turso.io?authToken=[TOKEN]
	// https://docs.turso.tech/sdk/go/quickstart
	if token == "" {
		return url, nil
	}
	sep := "?"
	if hasQ := (len(url) > 0 && url[len(url)-1] == '?') || (len(url) > 0 && containsRune(url, '?')); hasQ {
		sep = "&"
	}
	return fmt.Sprintf("%s%sauthToken=%s", url, sep, token), nil
}

func containsRune(s string, r rune) bool {
	for _, c := range s {
		if c == r {
			return true
		}
	}
	return false
}

func main() {
	// Basic structured logger at INFO level.
	h := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	slog.SetDefault(slog.New(h))

	args := parseArgs()
	authUsed := args.LibsqlAuthToken != ""

	slog.Info("Heartbeat service starting",
		"service_id", SERVICE_ID,
		"ping_interval_secs", args.IntervalSecs,
		"db", args.LibsqlURL,
		"auth_token_provided", authUsed,
	)

	// Build the remote URL first
	remoteURL, err := buildRemoteURL(args.LibsqlURL, args.LibsqlAuthToken)
	if err != nil {
		slog.Error("Invalid DB config", "error", err)
		os.Exit(1)
	}

	// Spawn the service health ping goroutine with the built URL
	go runServicePingTask(remoteURL)

	// Establish DB connection for OutgoingCommands
	db, err := sql.Open("libsql", remoteURL)
	if err != nil {
		slog.Error("Failed to open DB", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	// Optional: verify connectivity with a short ping
	dbCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	if err := db.PingContext(dbCtx); err != nil {
		cancel()
		slog.Error("Database ping failed", "error", err)
		os.Exit(1)
	}
	cancel()
	slog.Info("Successfully connected to database for queuing commands.")

	// Run the command queue loop (blocking)
	if err := runCommandQueueLoop(context.Background(), db, args.IntervalSecs); err != nil {
		slog.Error("Command queue loop terminated with error", "error", err)
		os.Exit(1)
	}
}
