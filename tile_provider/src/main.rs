use warp::http::{Method, Response};
use warp::Filter;

use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use dashmap::DashMap;
use r2d2::{Pool, PooledConnection};
use r2d2_sqlite::SqliteConnectionManager;
use reqwest::{Client, StatusCode};
use rusqlite::{params, Connection, OptionalExtension};
use tokio::time::interval;

const TILE_URL_TEMPLATE: &str = "http://mt2.google.com/vt/lyrs=s,h&x={y}&y={x}&z={z}";

#[derive(Default)]
struct Metrics {
    total_requests: u64,
    total_request_time: Duration,
    cache_hits: u64,
    cache_misses: u64,
}

#[tokio::main]
async fn main() {
    let manager = SqliteConnectionManager::file("tiles.db");

    let pool = Arc::new(Pool::new(manager).expect("Failed to create pool"));

    setup_db(&pool.get().expect("Failed to get DB connection"));

    let metrics = Arc::new(Mutex::new(Metrics::default()));
    let metrics_clone = Arc::clone(&metrics);

    // Initialize the in-memory cache
    let tile_cache = Arc::new(DashMap::new());

    tokio::spawn(async move {
        let mut interval = interval(Duration::from_secs(5));
        loop {
            interval.tick().await;
            print_metrics(&metrics_clone);
        }
    });

    let conn_filter = warp::any().map(move || Arc::clone(&pool));
    let metrics_filter = warp::any().map(move || Arc::clone(&metrics));
    let cache_filter = warp::any().map(move || Arc::clone(&tile_cache));

    let tile_route = warp::path!("tiles" / u8 / u32 / u32)
        .and(conn_filter)
        .and(metrics_filter)
        .and(cache_filter)
        .and_then(handle_tile_request);

    // Configure CORS
    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(&[Method::GET])
        .allow_headers(vec!["Content-Type"]);

    warp::serve(tile_route.with(cors))
        .run(([127, 0, 0, 1], 8080))
        .await;
}

fn setup_db(conn: &PooledConnection<SqliteConnectionManager>) {
    let journal_mode: String = conn
        .query_row("PRAGMA journal_mode = WAL", [], |row| row.get(0))
        .expect("Failed to set journal mode");

    if journal_mode != "wal" {
        panic!("Failed to set journal mode to WAL");
    }

    conn.execute(
        "CREATE TABLE IF NOT EXISTS tiles (
            zoom INTEGER,
            x INTEGER,
            y INTEGER,
            blob BLOB,
            PRIMARY KEY (zoom, x, y)
        )",
        [],
    )
    .expect("Failed to create tiles table");
}

async fn handle_tile_request(
    zoom: u8,
    x: u32,
    y: u32,
    pool: Arc<Pool<SqliteConnectionManager>>,
    metrics: Arc<Mutex<Metrics>>,
    cache: Arc<DashMap<(u8, u32, u32), Vec<u8>>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let start_time = Instant::now();

    // Check the cache first
    if let Some(blob) = cache.get(&(zoom, x, y)) {
        println!("Cache hit");
        // Cache hit
        update_metrics(metrics.clone(), true, start_time.elapsed());
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "image/png")
            .header("Cache-Control", "public, max-age=31536000")
            .body(blob.clone()) // Clone to ensure thread safety
            .unwrap());
    }

    // Cache miss - Check the database
    let conn = pool.get().expect("Failed to get DB connection");
    let result = tokio::task::block_in_place(|| get_tile_from_db(&conn, zoom, x, y));

    match result {
        Some(blob) => {
            // Save to cache for future requests
            cache.insert((zoom, x, y), blob.clone());
            update_metrics(metrics.clone(), true, start_time.elapsed());
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Cache-Control", "public, max-age=31536000")
                .header("Content-Type", "image/png")
                .body(blob)
                .unwrap())
        }
        None => match fetch_tile_from_source(zoom, x, y).await {
            Ok(blob) => {
                let conn_for_save = pool.get().expect("Failed to get DB connection");
                let blob_to_save = blob.clone();

                // Save to database and cache
                tokio::task::block_in_place(move || {
                    save_tile_to_db(&conn_for_save, zoom, x, y, &blob_to_save)
                });
                cache.insert((zoom, x, y), blob.clone());

                update_metrics(metrics.clone(), false, start_time.elapsed());
                Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Cache-Control", "public, max-age=31536000")
                    .header("Content-Type", "image/png")
                    .body(blob)
                    .unwrap())
            }
            Err(StatusCode::NOT_FOUND) => Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .header("Content-Type", "text/plain")
                .body("Tile not found".as_bytes().to_vec())
                .unwrap()),
            Err(_) => Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "text/plain")
                .body("Failed to fetch tile".as_bytes().to_vec())
                .unwrap()),
        },
    }
}

fn get_tile_from_db(conn: &Connection, zoom: u8, x: u32, y: u32) -> Option<Vec<u8>> {
    conn.query_row(
        "SELECT blob FROM tiles WHERE zoom = ? AND x = ? AND y = ?",
        params![zoom, x, y],
        |row| row.get(0),
    )
    .optional()
    .expect("Failed to query the database")
}

fn save_tile_to_db(conn: &Connection, zoom: u8, x: u32, y: u32, blob: &[u8]) {
    conn.execute(
        "INSERT OR REPLACE INTO tiles (zoom, x, y, blob) VALUES (?, ?, ?, ?)",
        params![zoom, x, y, blob],
    )
    .expect("Failed to save tile to database");
}

async fn fetch_tile_from_source(zoom: u8, x: u32, y: u32) -> Result<Vec<u8>, StatusCode> {
    let url = TILE_URL_TEMPLATE
        .replace("{z}", &zoom.to_string())
        .replace("{x}", &x.to_string())
        .replace("{y}", &y.to_string());

    // Create a reqwest client
    let client = Client::new();

    // Make a GET request with a custom User-Agent
    let response = client
        .get(&url)
        .header(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        )
        .send()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if response.status() == StatusCode::NOT_FOUND {
        Err(StatusCode::NOT_FOUND)
    } else if response.status().is_success() {
        Ok(response
            .bytes()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
            .to_vec())
    } else {
        println!("Failed to fetch tile: {}", response.status());
        println!("Failed URL: {}", url);
        if let Ok(body) = response.text().await {
            println!("Response body: {}", body);
        }
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

fn update_metrics(metrics: Arc<Mutex<Metrics>>, hit: bool, request_time: Duration) {
    let mut metrics = metrics.lock().unwrap();
    metrics.total_requests += 1;
    metrics.total_request_time += request_time;
    if hit {
        metrics.cache_hits += 1;
    } else {
        metrics.cache_misses += 1;
    }
}

fn print_metrics(metrics: &Arc<Mutex<Metrics>>) {
    let metrics = metrics.lock().unwrap();
    let avg_request_time = if metrics.total_requests > 0 {
        metrics.total_request_time.as_secs_f64() / metrics.total_requests as f64
    } else {
        0.0
    };
    let hit_ratio = if metrics.total_requests > 0 {
        metrics.cache_hits as f64 / metrics.total_requests as f64
    } else {
        0.0
    };

    println!(
        "Metrics (last 5s): Total Requests: {}, Average Request Time: {:.3} seconds, Hit Ratio: {:.2}%",
        metrics.total_requests, avg_request_time, hit_ratio * 100.0
    );
}
