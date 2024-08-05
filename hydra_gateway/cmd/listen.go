package cmd

import (
	"context"
	"fmt"
	"net"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/spf13/cobra"
	"go.bug.st/serial"
)

var RED = "\033[31m"
var BLUE = "\033[34m"
var GREEN = "\033[32m"
var END = "\033[0m"

var listenCmd = &cobra.Command{
	Use:   "listen",
	Short: "Exposes a serial port over TCP",
	Long:  `Creates a TCP server that listens for incoming connections and forwards data to a serial port.`,
	Run: func(cmd *cobra.Command, args []string) {

		// region Start TCP server

		tcp_port := cmd.Flag("port").Value.String()
		tcp_should_host := cmd.Flag("host").Value.String()

		if tcp_should_host == "true" {
			tcp_should_host = "0.0.0.0"
		} else {
			tcp_should_host = "127.0.0.1"
		}

		tcp_address := tcp_should_host + ":" + tcp_port

		listener, err := net.Listen("tcp", tcp_address)

		if err != nil {
			panic(err)
		}

		tcp_listener, ok := listener.(*net.TCPListener)

		if !ok {
			panic(err)
		}

		defer listener.Close()
		println(GREEN, "Listening on", tcp_address, END)

		// endregion

		// region Open serial port

		baudRate, err := strconv.Atoi(cmd.Flag("baud").Value.String())
		if err != nil {
			panic(err)
		}

		serial_listener, err := serial.Open(cmd.Flag("serial").Value.String(), &serial.Mode{
			BaudRate: baudRate,
		})

		if err != nil {
			panic(err)
		}
		defer serial_listener.Close()
		println(GREEN, "Opened serial port", cmd.Flag("serial").Value.String(), "at", baudRate, "baud", END)
		// endregion

		// region Create Channel for sending data
		serial_read_channel := make(chan []byte, (1<<16)-1)

		ctx, cancel := context.WithCancel(context.Background())
		var wg sync.WaitGroup

		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					println(BLUE, "Serial->SerialRead stopped because of a cancel", END)
					close(serial_read_channel)
					return
				default:
					buffer := make([]byte, 1024)
					n, err := serial_listener.Read(buffer)
					if err != nil {
						fmt.Fprintln(os.Stderr, RED, "[FATAL]", err, END)
						cancel()
						continue
					}
					serial_read_channel <- buffer[:n]
				}

			}
		}()

		// region Handle connections
		connections_list := make([]net.Conn, 0)

		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					println(BLUE, "TCP Acception stopped because of a cancel", END)
					return
				default:

					tcp_listener.SetDeadline(time.Now().Add(100 * time.Millisecond))

					conn, err := listener.Accept()
					if err != nil {
						// Ignore timeout errors
						if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
							continue
						}

						fmt.Fprintln(os.Stderr, RED+"[FATAL] Error accepting connection: "+END, err)
						cancel()
						continue
					}
					println(BLUE, "Accepted connection from", conn.RemoteAddr().String(), END)
					connections_list = append(connections_list, conn)
				}
			}
		}()
		// endregion

		// region Send serial data to all connections
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					println(BLUE, "SerialRead->TCP stopped because of a cancel", END)
					return
				default:
					data, ok := <-serial_read_channel
					if !ok {
						println(RED, "[FATAL] SerialRead->TCP stopped because of a channel close", END)
						cancel()
						continue
					}
					for i := len(connections_list) - 1; i >= 0; i-- {
						conn := connections_list[i]
						_, err := conn.Write(data)
						if err != nil {
							fmt.Fprintln(os.Stderr, RED+"Error writing to connection: "+END, err)
							conn.Close()
							connections_list = append(connections_list[:i], connections_list[i+1:]...)
							println(BLUE, "Removed connection", conn.RemoteAddr().String(), END)
						}
					}
				}
			}
		}()
		// endregion

		// region Read data from connections and send to serial
		wg.Add(1)
		serial_write_channel := make(chan []byte)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					println(BLUE, "TCP->SerialWrite stopped because of a cancel", END)
					return
				default:
					for i := len(connections_list) - 1; i >= 0; i-- {
						conn := connections_list[i]
						buffer := make([]byte, 1024)
						// Set timeout
						conn.SetReadDeadline(time.Now().Add(100 * time.Millisecond))
						n, err := conn.Read(buffer)
						if err != nil {
							if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
								continue
							}

							fmt.Fprintln(os.Stderr, RED+"Error reading from connection: "+END, err)
							conn.Close()
							connections_list = append(connections_list[:i], connections_list[i+1:]...)
							println(BLUE, "Removed connection", conn.RemoteAddr().String(), END)
							continue
						}
						// println("Sending", n, "bytes to serial chan")
						serial_write_channel <- buffer[:n]
						println("Wrote", n, "bytes to serial chan")
					}
				}
			}
		}()
		// endregion

		// region Write data from serial_write_channel to serial
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					println(BLUE, "SerialWrite->Serial stopped because of a cancel", END)
					return
				default:
					data, ok := <-serial_write_channel
					if !ok {
						println(RED, "[FATAL] SerialWrite->Serial stopped because of a channel close", END)
						cancel()
						continue
					}

					// Print data to str
					dataStr := ""
					for _, b := range data {
						dataStr += fmt.Sprintf("%02X ", b)
					}
					println("Received", len(data), "bytes from TCP:", dataStr)

					_, err := serial_listener.Write(data)
					drain_err := serial_listener.Drain()

					if drain_err != nil {
						fmt.Fprintln(os.Stderr, RED+"Error draining serial: "+END, err)
						cancel()
						continue
					}

					println("Wrote", len(data), "bytes to serial")

					if err != nil {
						fmt.Fprintln(os.Stderr, RED+"Error writing to serial: "+END, err)
						cancel()
						continue
					}

				}
			}
		}()
		// endregion

		wg.Wait()
		println("All done")

	},
}

func init() {
	listenCmd.Flags().StringP("serial", "s", "", "The serial port to listen on")
	listenCmd.Flags().UintP("baud", "b", 9600, "The baud rate to use")

	listenCmd.Flags().UintP("port", "p", 5656, "The port to listen on")
	listenCmd.Flags().Bool("host", false, "Whether to listen on all interfaces")

	listenCmd.MarkFlagRequired("serial")

	rootCmd.AddCommand(listenCmd)

}
