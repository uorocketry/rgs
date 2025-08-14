package main

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"net"
	"sync"
	"sync/atomic"
	"time"
)

func Serve(ctx context.Context, addr string, clients *Clients, serialOutbound chan<- []byte, verbose bool) error {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	defer ln.Close()

	slog.Info("TCP server listening", "address", addr)

	// Close listener on shutdown
	go func() {
		<-ctx.Done()
		_ = ln.Close()
	}()

	var wg sync.WaitGroup
	defer wg.Wait()

	for {
		conn, err := ln.Accept()
		if err != nil {
			select {
			case <-ctx.Done():
				slog.Info("TCP listener shutting down")
				return nil
			default:
			}
			var ne net.Error
			if errors.As(err, &ne) && ne.Temporary() {
				continue
			}
			slog.Error("Accept error", "error", err)
			continue
		}

		wg.Add(1)
		go func(c net.Conn) {
			defer wg.Done()
			handleConn(ctx, c, clients, serialOutbound, verbose)
		}(conn)
	}
}

func handleConn(ctx context.Context, conn net.Conn, clients *Clients, serialOutbound chan<- []byte, verbose bool) {
	addr := conn.RemoteAddr().String()
	slog.Info("Accepted TCP connection", "address", addr)
	defer func() {
		_ = conn.Close()
		clients.Remove(addr)
		slog.Info("Closed TCP connection", "address", addr)
	}()

	// Per-connection writer queue (broadcast consumer)
	tx := make(chan []byte, 256)
	clients.Add(addr, tx)

	// Writer goroutine: serial→TCP
	var stopping int32
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			select {
			case <-ctx.Done():
				return
			case p, ok := <-tx:
				if !ok || atomic.LoadInt32(&stopping) == 1 {
					return
				}
				if _, err := conn.Write(p); err != nil {
					slog.Warn("Write to TCP client failed", "address", addr, "error", err)
					atomic.StoreInt32(&stopping, 1)
					return
				}
			}
		}
	}()

	// Reader loop: TCP→serial (enqueue to serial manager)
	buf := make([]byte, 4096)
	for atomic.LoadInt32(&stopping) == 0 {
		_ = conn.SetReadDeadline(time.Now().Add(200 * time.Millisecond))
		n, err := conn.Read(buf)
		if err != nil {
			var ne net.Error
			if errors.As(err, &ne) && ne.Timeout() {
				select {
				case <-ctx.Done():
					atomic.StoreInt32(&stopping, 1)
					break
				default:
					continue
				}
			}
			if errors.Is(err, io.EOF) {
				slog.Info("TCP client disconnected", "address", addr)
			} else {
				slog.Warn("Read from TCP client failed", "address", addr, "error", err)
			}
			atomic.StoreInt32(&stopping, 1)
			break
		}
		if n > 0 {
			msg := make([]byte, n)
			copy(msg, buf[:n])
			select {
			case serialOutbound <- msg:
				if verbose {
					slog.Info("Enqueued TCP→Serial", "address", addr, "bytes", n)
				}
			case <-ctx.Done():
				atomic.StoreInt32(&stopping, 1)
			}
		}
	}

	wg.Wait()
}
