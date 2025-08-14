package main

import (
	"fmt"
	"log/slog"

	"go.bug.st/serial"
)

func List() error {
	ports, err := serial.GetPortsList()
	if err != nil {
		return fmt.Errorf("get ports list: %w", err)
	}
	if len(ports) == 0 {
		slog.Info("No serial ports found")
		return nil
	}
	for i, p := range ports {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(p)
	}
	fmt.Println()
	return nil
}
