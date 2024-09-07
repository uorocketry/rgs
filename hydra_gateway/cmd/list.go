package cmd

import (
	"fmt"
	"log"

	"github.com/spf13/cobra"
	"go.bug.st/serial"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List serial ports",
	Long:  `Will return a list of paths to serial ports found on the system separated by newlines.`,
	Run: func(cmd *cobra.Command, args []string) {
		ports, err := serial.GetPortsList()
		if err != nil {
			log.Fatal(err)
		}
		if len(ports) == 0 {
			log.Fatal("No serial ports found!")
		}
		for _, port := range ports {
			fmt.Println(port)
		}
	},
}

func init() {
	rootCmd.AddCommand(listCmd)
}
