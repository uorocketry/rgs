package main

import (
	"container/list"
	"context"
	"errors"
	"io"
	"log/slog"
	"sync/atomic"
	"time"

	"go.bug.st/serial"
)

type Config struct {
	Port             string
	Baud             int
	ReadTimeout      time.Duration
	ReconnectBase    time.Duration // e.g. 200ms
	ReconnectMax     time.Duration // e.g. 2s
	WriteBufferLimit int           // bytes retained while unplugged
	Verbose          bool
}

type Manager struct {
	cfg         Config
	outbound    chan []byte
	portCh      chan portSession
	running     atomic.Bool
	broadcastFn func([]byte)
}

type portSession struct {
	port   serial.Port
	cancel context.CancelFunc
}

func New(cfg Config, broadcast func([]byte)) *Manager {
	if cfg.ReadTimeout <= 0 {
		cfg.ReadTimeout = 2 * time.Second
	}
	if cfg.ReconnectBase <= 0 {
		cfg.ReconnectBase = time.Second
	}
	if cfg.ReconnectMax < cfg.ReconnectBase {
		cfg.ReconnectMax = 2 * time.Second
	}
	if cfg.WriteBufferLimit <= 0 {
		cfg.WriteBufferLimit = 256 * 1024
	}
	return &Manager{
		cfg:         cfg,
		outbound:    make(chan []byte, 1024), // ingress from TCP writers
		portCh:      make(chan portSession, 1),
		broadcastFn: broadcast,
	}
}

func (m *Manager) Outbound() chan<- []byte { return m.outbound }

// Run starts the reconnect loop, read pump, and write pump.
// It returns when ctx is cancelled.
func (m *Manager) Run(ctx context.Context) {
	if m.running.Swap(true) {
		return
	}
	defer m.running.Store(false)

	// Start TX pump (always running, buffers while port is down)
	go m.txLoop(ctx)

	// Serial (re)connect loop
	backoff := m.cfg.ReconnectBase
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		// Try open
		mode := &serial.Mode{
			BaudRate: m.cfg.Baud,
			DataBits: 8,
			Parity:   serial.NoParity,
			StopBits: serial.OneStopBit,
		}
		sp, err := serial.Open(m.cfg.Port, mode)
		if err != nil {
			slog.Warn("Open serial failed; will retry", "port", m.cfg.Port, "error", err, "delay", backoff)
			time.Sleep(backoff)
			// Linear backoff: always use 1 second
			backoff = time.Second
			continue
		}
		_ = sp.SetReadTimeout(m.cfg.ReadTimeout)
		slog.Info("Serial port opened", "port", m.cfg.Port, "baud", m.cfg.Baud)
		backoff = m.cfg.ReconnectBase

		// New session context
		sessCtx, sessCancel := context.WithCancel(ctx)
		// Notify TX loop of the new port
		select {
		case m.portCh <- portSession{port: sp, cancel: sessCancel}:
		case <-sessCtx.Done():
			sp.Close()
			return
		}

		// Read loop blocks until error or cancellation
		err = m.rxLoop(sessCtx, sp)
		sp.Close()
		if errors.Is(err, context.Canceled) {
			return
		}
		// Any other error => reconnect
		slog.Warn("Serial session ended; will reconnect", "error", err)
		// Keep loop running; immediately attempt reopen (will backoff if still missing)
	}
}

func (m *Manager) rxLoop(ctx context.Context, sp serial.Port) error {
	buf := make([]byte, 4096)
	for {
		select {
		case <-ctx.Done():
			return context.Canceled
		default:
		}
		n, err := sp.Read(buf)
		if err != nil {
			// Timeout? keep going.
			var ne interface{ Timeout() bool }
			if errors.As(err, &ne) && ne.Timeout() {
				continue
			}
			if errors.Is(err, io.EOF) {
				return io.EOF
			}
			return err
		}
		if n > 0 {
			data := make([]byte, n)
			copy(data, buf[:n])
			if m.cfg.Verbose {
				slog.Info("Serial→TCP", "bytes", n)
			}
			m.broadcastFn(data)
		}
	}
}

// txLoop receives outbound messages, buffers while the port is down,
// and flushes when a session is available. If a write fails, it cancels
// the session to force a reconnect and keeps the pending message queued.
func (m *Manager) txLoop(ctx context.Context) {
	type session struct {
		sp     serial.Port
		cancel context.CancelFunc
	}
	var cur *session

	// Bounded byte buffer (drop-oldest policy on overflow)
	q := &byteQueue{
		l:     list.New(),
		limit: m.cfg.WriteBufferLimit,
		size:  0,
	}

	for {
		// If we have a session and pending data, try to flush greedily.
		if cur != nil && q.size > 0 {
			for q.size > 0 {
				msg := q.front()
				_, err := cur.sp.Write(msg)
				if err != nil {
					slog.Warn("Serial write failed; cancelling session for reconnect", "error", err)
					cur.cancel() // triggers rxLoop to exit; Run() will reconnect
					cur = nil
					break // stop flushing; keep msg at front for retry after reconnect
				}
				q.pop()
				if m.cfg.Verbose {
					slog.Info("TCP→Serial", "bytes", len(msg))
				}
			}
		}

		select {
		case <-ctx.Done():
			return

		case ps := <-m.portCh:
			// New session arrived
			cur = &session{sp: ps.port, cancel: ps.cancel}
			// Try immediate flush of any buffered messages (loop head will handle)

		case msg := <-m.outbound:
			// Always enqueue; txLoop owns the queue
			q.push(msg)
			if cur == nil {
				// No port right now; just buffered
				if m.cfg.Verbose {
					slog.Info("Buffered outbound while serial unavailable", "queued_bytes", q.size, "limit", q.limit)
				}
			}
			// if cur != nil, top-of-loop will flush
		}
	}
}

// --- small bounded FIFO for [][]byte with byte-count limit ---

type byteQueue struct {
	l     *list.List    // elements are []byte
	limit int           // max total bytes
	size  int           // current total bytes
}

func (q *byteQueue) push(b []byte) {
	if len(b) == 0 {
		return
	}
	// If this single message is bigger than the limit, keep last limit bytes.
	if len(b) > q.limit {
		b = b[len(b)-q.limit:]
	}

	q.l.PushBack(b)
	q.size += len(b)
	// Drop-oldest until within limit
	for q.size > q.limit && q.l.Len() > 0 {
		oldest := q.l.Front()
		if oldest != nil {
			ob := oldest.Value.([]byte)
			q.size -= len(ob)
			q.l.Remove(oldest)
		}
	}
	if q.size > q.limit {
		q.size = q.limit
	}
}

func (q *byteQueue) front() []byte {
	e := q.l.Front()
	if e == nil {
		return nil
	}
	return e.Value.([]byte)
}

func (q *byteQueue) pop() {
	e := q.l.Front()
	if e == nil {
		return
	}
	b := e.Value.([]byte)
	q.size -= len(b)
	q.l.Remove(e)
}
