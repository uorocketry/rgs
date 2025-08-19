package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log/slog"
	"time"
)

func runCommandQueueLoop(ctx context.Context, db *sql.DB, intervalSecs uint64) error {
	slog.Info("Command queue loop started", "interval_secs", intervalSecs)

	ticker := time.NewTicker(time.Duration(intervalSecs) * time.Second)
	defer ticker.Stop()

	var nextPingID uint32 = 1

	for {
		<-ticker.C

		currentTimestamp := time.Now().UTC().Unix()
		commandType := "Ping"
		var parameters *string = nil // Will be set to JSON with {"id": n}
		status := "Pending"

		slog.Info("Attempting to queue command",
			"type", commandType,
			"service_id", SERVICE_ID,
		)

		// Build parameters JSON with increasing id
		{
			payload := struct {
				ID uint32 `json:"id"`
			}{ID: nextPingID}
			if b, err := json.Marshal(payload); err == nil {
				p := string(b)
				parameters = &p
			} else {
				slog.Warn("Failed to marshal ping parameters; defaulting to NULL", "error", err)
			}
			nextPingID++
		}

		execCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		res, err := db.ExecContext(execCtx,
			`INSERT INTO OutgoingCommand (command_type, parameters, status, created_at, source_service)
			 VALUES (?, ?, ?, ?, ?)`,
			commandType, parameters, status, currentTimestamp, SERVICE_ID,
		)
		cancel()

		if err != nil {
			// Mirror Rust behavior: log error; keep loop running (or return to let supervisor restart).
			slog.Error("Failed to queue command",
				"type", commandType,
				"error", err,
			)
			// If you prefer to make the process exit on persistent failure:
			// return err
			continue
		}

		affected, _ := res.RowsAffected()
		if affected > 0 {
			slog.Info("Successfully queued command", "type", commandType, "rows_affected", affected)
		} else {
			slog.Warn("Queued command but no rows affected; check schema/constraints", "type", commandType)
		}
	}
}
