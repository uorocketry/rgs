package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/r3labs/sse"
)

// sseProducer subscribes to a Server-Sent Events (SSE) stream and sends the events to a channel.
// It takes a context for cancellation, a record string to subscribe to, and a channel to send the events to.
// The function returns an error if there's an issue with the SSE subscription or sending the events to the channel.
func sseProducer(ctx context.Context, base_url string, record string, c chan *sse.Event) error {
	// client := sse.NewClient("http://127.0.0.1:8090/api/realtime/")
	// fix me
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

func main() {
	recordPtr := flag.String("record", "", "name of the record to subscribe to")
	// urlPtr := flag.String("url", "", "base URL of the API")
	flag.Parse()

	// if *recordPtr == "" || *urlPtr == "" {
	if *recordPtr == "" {
		log.Fatal("record flags are required")
	}

	record := *recordPtr
	// base_url := *urlPtr

	ctx, cancel := context.WithCancel(context.Background())

	sseChan := make(chan *sse.Event)

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		// sseProducer(ctx, base_url, record, sseChan)
		sseProducer(ctx, "", record, sseChan)
		wg.Done()
	}()

	// In the meantime just print the events
L:
	for {
		select {
		case <-ctx.Done():
			break L
		case msg, ok := <-sseChan:
			if !ok {
				break L
			}
			os.Stdout.Write(msg.Data)
			os.Stdout.Write([]byte("\n"))
		}
	}
	cancel()
}
