package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/r3labs/sse"
	"nhooyr.io/websocket"
)

// sseProducer subscribes to a Server-Sent Events (SSE) stream and sends the events to a channel.
// It takes a context for cancellation, a record string to subscribe to, and a channel to send the events to.
// The function returns an error if there's an issue with the SSE subscription or sending the events to the channel.
func sseProducer(ctx context.Context, record string, c chan *sse.Event) error {
	client := sse.NewClient("http://127.0.0.1:8090/api/realtime/")
	events := make(chan *sse.Event)
	client.SubscribeChan("PB_CONNECT", events)
	defer client.Unsubscribe(events)

	// First message
	msg := <-events
	var jsonObj struct {
		ClientId string `json:"clientId"`
	}
	err := json.Unmarshal(msg.Data, &jsonObj)
	if err != nil {
		close(c)
		return err
	}

	headers := http.Header{
		"Content-Type": []string{"application/json"},
		"Accept":       []string{"application/json"},
	}

	req, err := http.NewRequest(
		"POST", "http://127.0.0.1:8090/api/realtime/",
		strings.NewReader(fmt.Sprintf(`{"clientId":"%s","subscriptions":["%s"]}`, jsonObj.ClientId, record)))
	req.Header = headers

	if err != nil {
		close(c)
		return err
	}
	resp, err := http.DefaultClient.Do(req)
	_ = resp

	if err != nil {
		close(c)
		return err
	}

	for {
		// Switch done and events
		select {
		case <-ctx.Done():
			return nil
		case msg, ok := <-events:
			if !ok {
				close(c)
				return nil
			}
			c <- msg
		}
	}
}

// Channel reader goroutine
// readMessageChannel reads messages from a WebSocket connection and sends them to a channel.
// It takes a context for cancellation, a WebSocket connection, and a channel to send the messages to.
// The function returns an error if there's an issue with reading from the WebSocket or sending the messages to the channel.
func readMessageChannel(ctx context.Context, conn *websocket.Conn, c chan []byte) error {
	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			msgType, msg, err := conn.Read(ctx)

			if err != nil {
				close(c)
				return err
			}
			if msgType == websocket.MessageText {
				c <- msg
			} else {
				log.Println("Message type not supported:", msgType)
			}
		}
	}
}

func wsEndpoint(c echo.Context) error {
	record := c.PathParam("record")

	ws, err := websocket.Accept(c.Response(), c.Request(), &websocket.AcceptOptions{
		OriginPatterns: []string{"*"},
	})

	if err != nil {
		log.Println(err)
		return err
	}
	defer ws.CloseNow()
	log.Println("Client Connected")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	wg := &sync.WaitGroup{}
	sseChan := make(chan *sse.Event)
	wg.Add(1)
	log.Println("sseProducer 🟢")
	go func() {
		defer wg.Done()
		err := sseProducer(ctx, record, sseChan)
		if err != nil {
			log.Println("sseProducer error:", err.Error())
		}
		log.Println("sseProducer 🔴")
	}()

	wsReadChan := make(chan []byte)
	wg.Add(1)
	log.Println("readMessageChannel 🟢")
	go func() {
		defer wg.Done()
		err := readMessageChannel(ctx, ws, wsReadChan)
		if err != nil {
			log.Println("readMessageChannel error:", err.Error())
		}
		log.Println("readMessageChannel 🔴")
	}()

L:
	for {
		select {
		case channelMsg, ok := <-sseChan:
			if !ok {
				break L
			}
			log.Println("🖥️ Message from SSE:", string(channelMsg.Data))
			p := channelMsg.Data
			err := ws.Write(ctx, websocket.MessageText, p)
			if err != nil {
				log.Println("Error writing message |", err.Error())
				break L
			}
		case msg, ok := <-wsReadChan:
			if !ok {
				break L
			}
			log.Println("🖊️ Message from client:", string(msg))

		}
	}

	log.Println("❌ Cancelling goroutines")
	cancel()
	wg.Wait()
	log.Println("Connection closed 🥳")
	return nil
}

func main() {
	log.Println("Starting server...")
	app := pocketbase.New()

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load jsvm (hooks and migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
	})

	// migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
	})

	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(30) * time.Second
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), indexFallback))
		// ws endpoint
		e.Router.GET("/realtime/:record", wsEndpoint)
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}