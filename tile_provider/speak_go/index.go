package main

import (
    "database/sql"
    //"encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "strconv"
	_ "github.com/mattn/go-sqlite3"
)

type Config struct {
    Database  string
    Address   string
    Port      int
    TileSource struct {
        BaseURL string
    }
}

type TileDatabase struct {
    db *sql.DB
}

func (td *TileDatabase) GetTile(zoom, x, y int) ([]byte, error) {
    var blob []byte
    err := td.db.QueryRow("SELECT blob FROM tiles WHERE zoom = ? AND x = ? AND y = ?", zoom, x, y).Scan(&blob)
    return blob, err
}

func (td *TileDatabase) SaveTile(zoom, x, y int, blob []byte) error {
    _, err := td.db.Exec("INSERT OR REPLACE INTO tiles (zoom, x, y, blob) VALUES (?, ?, ?, ?)", zoom, x, y, blob)
    return err
}

func handleTileRequest(w http.ResponseWriter, r *http.Request, tileDb *TileDatabase, config Config) {
    // Parse URL parameters
    zoom, _ := strconv.Atoi(r.URL.Query().Get("zoom"))
    x, _ := strconv.Atoi(r.URL.Query().Get("x"))
    y, _ := strconv.Atoi(r.URL.Query().Get("y"))

    // Check the database for the tile
    blob, err := tileDb.GetTile(zoom, x, y)
    if err == nil {
        w.Header().Set("Content-Type", "image/png")
        w.Header().Set("Cache-Control", "public, max-age=31536000")
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Write(blob)
        return
    }

    // Fetch from the remote source
    url := fmt.Sprintf("%s&x=%d&y=%d&z=%d", config.TileSource.BaseURL, x, y, zoom)
    resp, err := http.Get(url)
    if err != nil || resp.StatusCode != http.StatusOK {
        http.Error(w, "Failed to fetch tile", http.StatusInternalServerError)
        return
    }

    defer resp.Body.Close()
    buffer, _ := ioutil.ReadAll(resp.Body)

    // Save to database
    tileDb.SaveTile(zoom, x, y, buffer)

    w.Header().Set("Content-Type",  "image/png")
    w.Header().Set("Cache-Control", "public, max-age=31536000")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Write(buffer)
}

func main() {
    // Load config (dummy config here for example purposes)
    config := Config{
        Database: "tiles.db",
        Address:  "localhost",
        Port:     8080,
    }
    config.TileSource.BaseURL = "http://example.com/tiles"

    fmt.Printf("Opening DB at: %s\n", config.Database)
    fmt.Printf("Using address: %s\n", config.Address)
    fmt.Printf("Using port: %d\n", config.Port)

    // Connect to SQLite database
    db, err := sql.Open("sqlite3", config.Database)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS tiles (
            zoom INTEGER,
            x INTEGER,
            y INTEGER,
            blob BLOB,
            PRIMARY KEY (zoom, x, y)
        );
    `)
    if err != nil {
        log.Fatal(err)
    }


    tileDb := &TileDatabase{db: db}

    http.HandleFunc("/tiles/", func(w http.ResponseWriter, r *http.Request) {
        handleTileRequest(w, r, tileDb, config)
    })

    fmt.Printf("Starting server at %s:%d\n", config.Address, config.Port)
    log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%d", config.Address, config.Port), nil))
}
