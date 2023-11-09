package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/r3labs/sse"
)

// Creates a SSE client and subscribes to the specified record
// Sends the SSE events to the channel
func sseProducer(record string, c chan *sse.Event, done chan bool) {
	client := sse.NewClient("http://127.0.0.1:8090/api/realtime/")
	events := make(chan *sse.Event)
	client.SubscribeChan("PB_CONNECT", events)

	// FIrst message
	msg := <-events
	var jsonObj struct {
		ClientId string `json:"clientId"`
	}
	err := json.Unmarshal(msg.Data, &jsonObj)
	if err != nil {
		log.Fatal(err)
	}

	headers := http.Header{
		"Content-Type": []string{"application/json"},
		"Accept":       []string{"application/json"},
	}

	req, err := http.NewRequest("POST", "http://127.0.0.1:8090/api/realtime/", strings.NewReader(fmt.Sprintf(`{"clientId":"%s","subscriptions":["%s"]}`, jsonObj.ClientId, record)))
	req.Header = headers

	if err != nil {
		log.Println("Error creating request obj |", err.Error())
		return
	}

	_resp, err := http.DefaultClient.Do(req)
	_ = _resp
	if err != nil {
		log.Println("Error posting request |", err.Error())
		return
	}

	for {
		// Switch done and events
		select {
		case <-done:
			log.Println("Closing SSE channel")
			client.Unsubscribe(events)
			done <- true
			return
		case msg := <-events:
			c <- msg
		}
	}
}

func websockReader(conn *websocket.Conn, c chan []byte, done chan bool) {
	for {
		msgType, msg, error := conn.ReadMessage()
		if error != nil {
			done <- true
			log.Println("Error reading message |", error.Error())
			return
		}
		if msgType == 1 {
			c <- msg
		} else {
			log.Println("Message type not supported:", msgType)
		}
	}
}

// Channel reader goroutine
func readMessageChannel(conn *websocket.Conn, c chan []byte, done chan bool) {
	wsMsgChan := make(chan []byte)
	go websockReader(conn, wsMsgChan, done)

	for {
		select {
		case <-done:
			log.Println("Closing read channel")
			return
		case msg := <-wsMsgChan:
			c <- msg
		default:
		}

	}
}

func reader(conn *websocket.Conn) {
	// Create a channel to receive messages
	done := make(chan bool)
	sseChan := make(chan *sse.Event)

	go sseProducer("Air", sseChan, done)

	wsReadChan := make(chan []byte)
	go readMessageChannel(conn, wsReadChan, done)

	for {
		select {
		case <-done:
			log.Println("Closing connection")
			return
		case msg := <-wsReadChan:
			log.Println("Message from client:", string(msg))
		case channelMsg := <-sseChan:
			log.Println("Message from SSE:", string(channelMsg.Data))
			p := channelMsg.Data
			errWrite := conn.WriteMessage(1, p)
			if errWrite != nil {
				done <- true
				return
			}
		default:

		}
	}
}

func wsEndpoint(c echo.Context) error {
	// Get :record parameter
	record := c.PathParam("record")
	log.Println(record)

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Println(err)
	}
	log.Println("Client Connected")
	err = ws.WriteMessage(1, []byte("Hi Client!"))
	if err != nil {
		log.Println(err)
	}
	// listen indefinitely for new messages coming
	// through on our WebSocket connection
	reader(ws)
	return nil
}

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {
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
