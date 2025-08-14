package main

import (
	"context"
	"database/sql"
	"log/slog"
	"os"
	"time"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

const healthPingInterval = 30 * time.Second

func runServicePingTask(dbURL, authToken string) {
	host, err := os.Hostname()
	if err != nil || host == "" {
		host = "unknown_hostname"
	}

	slog.Info("ServicePing task started",
		"service_id", SERVICE_ID,
		"db", dbURL,
		"auth_token_provided", authToken != "",
		"interval_secs", int(healthPingInterval.Seconds()),
		"hostname", host,
	)

	// Each tick: open a fresh connection (keeps logic closest to the Rust task),
	// insert a row, then close. You can also reuse a shared *sql.DB if preferred.
	ticker := time.NewTicker(healthPingInterval)
	defer ticker.Stop()

	for {
		<-ticker.C

		remoteURL, err := buildRemoteURL(dbURL, authToken)
		if err != nil {
			slog.Warn("ServicePing: invalid DB URL", "error", err)
			continue
		}

		db, err := sql.Open("libsql", remoteURL)
		if err != nil {
			slog.Warn("ServicePing: failed to open DB", "error", err)
			continue
		}

		appTimestamp := time.Now().Unix()

		slog.Info("Sending ServicePing", "service_id", SERVICE_ID, "hostname", host)

		execCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		_, execErr := db.ExecContext(execCtx,
			`INSERT INTO ServicePing (service_id, hostname, app_timestamp)
			 VALUES (?, ?, ?)`,
			SERVICE_ID, host, appTimestamp,
		)
		cancel()

		if execErr != nil {
			slog.Warn("Failed to send ServicePing", "error", execErr)
		}

		closeErr := db.Close()
		if closeErr != nil {
			slog.Warn("ServicePing: failed closing DB", "error", closeErr)
		}
	}
}
