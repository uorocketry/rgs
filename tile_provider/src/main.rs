use clap::Parser;
use tracing_subscriber::filter::Targets;
use tracing_subscriber::layer::SubscriberExt;
use warp::http::{Method, Response};
use warp::Filter;

use std::sync::Arc;

use dashmap::DashMap;
use r2d2::{Pool, PooledConnection};
use r2d2_sqlite::SqliteConnectionManager;
use reqwest::{Client, StatusCode};
use rusqlite::{params, Connection, OptionalExtension};

use tracing::{info, trace, Level};
use tracing_subscriber::{self};
use tracing_subscriber::{fmt, prelude::*};

/// CLI arguments
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 6565)]
    port: u16,

    #[arg(long, default_value = "tiles.db")]
    database: String,
}

const TILE_URL_TEMPLATE: &str = "http://mt2.google.com/vt/lyrs=s,h&x={y}&y={x}&z={z}";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let filter = Targets::new()
        .with_target(module_path!().split("::").next().unwrap(), Level::TRACE)
        .with_default(Level::WARN);
    tracing_subscriber::registry()
        .with(filter)
        .with(fmt::layer())
        .init();

    let args = Args::parse();

    info!("Starting server at {}:{}", args.address, args.port);

    let manager = SqliteConnectionManager::file(&args.database);
    let pool = Arc::new(Pool::new(manager).expect("Failed to create pool"));

    setup_db(&pool.get().expect("Failed to get DB connection"));

    let tile_cache = Arc::new(DashMap::new());

    let conn_filter = warp::any().map(move || Arc::clone(&pool));
    let cache_filter = warp::any().map(move || Arc::clone(&tile_cache));

    let tile_route = warp::path!("tiles" / u8 / u32 / u32)
        .and(conn_filter)
        .and(cache_filter)
        .and_then(handle_tile_request);

    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(&[Method::GET])
        .allow_headers(vec!["Content-Type"]);

    let address: std::net::IpAddr = args.address.parse().expect("Invalid IP address format");
    warp::serve(tile_route.with(cors))
        .run((address, args.port))
        .await;

    Ok(())
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
    cache: Arc<DashMap<(u8, u32, u32), Vec<u8>>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    if let Some(blob) = cache.get(&(zoom, x, y)) {
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "image/png")
            .header("Cache-Control", "public, max-age=31536000")
            .body(blob.clone())
            .unwrap());
    }

    let conn = pool.get().expect("Failed to get DB connection");
    let result = tokio::task::block_in_place(|| get_tile_from_db(&conn, zoom, x, y));

    match result {
        Some(blob) => {
            cache.insert((zoom, x, y), blob.clone());
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
                tokio::task::block_in_place(move || {
                    save_tile_to_db(&conn_for_save, zoom, x, y, &blob_to_save)
                });
                cache.insert((zoom, x, y), blob.clone());

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
                .body("Tile not found".into())
                .unwrap()),
            Err(_) => Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "text/plain")
                .body("Failed to fetch tile".into())
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

    let client = Client::new();
    let response = client
        .get(&url)
        .header("User-Agent", "Hydrate/1.0")
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
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
