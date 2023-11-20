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
	fullBaseUrl := base_url + "/api/realtime/"
	client := sse.NewClient(fullBaseUrl)
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

	bodyStr := fmt.Sprintf(`{"clientId":"%s","subscriptions":["%s"]}`, jsonObj.ClientId, record)
	bodyReader := strings.NewReader(bodyStr)

	req, err := http.NewRequest(
		"POST", fullBaseUrl,
		bodyReader)
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
	recordFlag := flag.String("record", "", "name of the record to subscribe to")
	portFlag := flag.String("port", "3001", "port of the API")
	baseUrlFlag := flag.String("base-url", "http://localhost", "base URL of the API")

	flag.Parse()

	// if *recordPtr == "" || *urlPtr == "" {
	if *recordFlag == "" {
		log.Fatal("record flags are required")
	}

	record := *recordFlag
	baseUrl := *baseUrlFlag + ":" + *portFlag

	ctx, cancel := context.WithCancel(context.Background())

	sseChan := make(chan *sse.Event)

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		sseProducer(ctx, baseUrl, record, sseChan)
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
