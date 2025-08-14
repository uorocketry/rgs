package main

import (
	"log/slog"
	"os"
)

func Setup(json bool, level slog.Leveler) {
	var h slog.Handler
	if json {
		h = slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{Level: level})
	} else {
		h = slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: level})
	}
	slog.SetDefault(slog.New(h))
}
