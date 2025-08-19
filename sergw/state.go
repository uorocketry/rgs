package main

import (
	"log/slog"
	"sync"
)

type Clients struct {
	m       sync.Map // key: string (addr), val: chan []byte
	verbose bool
}

func NewClients(verbose bool) *Clients {
	return &Clients{verbose: verbose}
}

func (c *Clients) Add(addr string, ch chan []byte) {
	c.m.Store(addr, ch)
	if c.verbose {
		var n int
		c.m.Range(func(_, _ any) bool { n++; return true })
		slog.Info("Added TCP connection", "address", addr, "total", n)
	}
}

func (c *Clients) Remove(addr string) {
	if v, ok := c.m.LoadAndDelete(addr); ok {
		close(v.(chan []byte))
		if c.verbose {
			var n int
			c.m.Range(func(_, _ any) bool { n++; return true })
			slog.Info("Removed TCP connection", "address", addr, "total", n)
		}
	}
}

func (c *Clients) Broadcast(p []byte) {
	// Non-blocking fanout; drop if per-conn queue full
	c.m.Range(func(key, value any) bool {
		addr := key.(string)
		ch := value.(chan []byte)
		select {
		case ch <- p:
		default:
			slog.Warn("Client queue full; dropping broadcast", "address", addr)
		}
		return true
	})
}
