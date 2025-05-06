mod random_message;

use clap::Parser;
use libsql::Builder;
use messages::mavlink::{self, MAVLinkV2MessageRaw};
use std::time::SystemTime;
use tokio::io::AsyncWriteExt;
use tokio::net::{TcpListener, TcpStream};
use tokio::time::{sleep, Duration};
use tracing::{error, info, warn};
use tracing_subscriber;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,

    // sleep time in ms
    #[arg(short, long, default_value_t = 100)]
    interval: u64,

    #[arg(long, default_value = "http://localhost:8080")]
    libsql_url: String,
}

async fn handle_connection(mut stream: TcpStream, interval: u64) {
    let peer_addr = match stream.peer_addr() {
        Ok(addr) => addr.to_string(),
        Err(e) => {
            error!("Failed to get peer address, not accepting: {:?}", e);
            String::from("Unknown")
        }
    };
    info!("Handling connection from {}", peer_addr);
    let mut i = 0;
    loop {
        let message = random_message::random_message();
        let mut message_raw = MAVLinkV2MessageRaw::new();
        message_raw.serialize_message(
            mavlink::MavHeader {
                system_id: 0,
                component_id: 0,
                sequence: i,
            },
            &message,
        );
        i = i.wrapping_add(1);
        println!("Sending message {}", i);
        // i = i.wrapping_add_signed(1);

        // if rand::random::<u8>() > 144 {
        //     i = i.wrapping_add_signed(1);
        // }

        if let Err(e) = stream.write_all(&message_raw.raw_bytes()).await {
            error!(
                "Failed to send message to client {}. REASON: {:?}",
                peer_addr, e
            );
            break;
        }
        sleep(Duration::from_millis(interval)).await;
    }
    info!("Connection closed for {}", peer_addr);
}

async fn run_heartbeat_task(db_url: String) {
    let hostname = hostname::get()
        .map(|s| {
            s.into_string()
                .unwrap_or_else(|_| "invalid_hostname".to_string())
        })
        .unwrap_or_else(|_| "unknown_hostname".to_string());

    info!(
        "Heartbeat task started. Will ping DB at {} every 30s. Hostname: {}",
        db_url, hostname
    );

    loop {
        sleep(Duration::from_secs(30)).await;

        let db_result = async {
            let builder = Builder::new_remote(db_url.clone(), "".to_string());
            let db = builder.build().await?;
            let conn = db.connect()?;

            let app_timestamp = SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);

            // Clone hostname inside the async block for ownership
            let owned_hostname = hostname.clone();

            info!("Sending heartbeat ping for service 'hydrand'");
            conn.execute(
                "INSERT INTO ServicePing (service_id, hostname, app_timestamp) VALUES (?1, ?2, ?3)",
                libsql::params!["hydrand", owned_hostname, app_timestamp as i64],
            )
            .await?;

            Ok::<(), Box<dyn std::error::Error + Send + Sync>>(())
        }
        .await;

        if let Err(e) = db_result {
            warn!("Failed to send heartbeat ping: {}", e);
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let args = Args::parse();

    // Pass the libsql_url from args to the task
    let db_url_for_task = args.libsql_url.clone();
    tokio::spawn(run_heartbeat_task(db_url_for_task));

    info!("Attempting to bind to {}:{}", args.address, args.port);
    let listener = match TcpListener::bind(format!("{}:{}", args.address, args.port)).await {
        Ok(listener) => {
            info!("Server created successfully");
            listener
        }
        Err(error) => {
            error!("Failed to connect: {}", error);
            return Err(error.into());
        }
    };

    info!("Listening for connections on {}", listener.local_addr()?);

    loop {
        match listener.accept().await {
            Ok((stream, _addr)) => {
                let peer_addr = match stream.peer_addr() {
                    Ok(addr) => addr.to_string(),
                    Err(e) => {
                        error!("Failed to get peer address, not accepting: {:?}", e);
                        continue;
                    }
                };
                info!("New connection: {}", peer_addr);
                let interval = args.interval;
                tokio::spawn(async move {
                    handle_connection(stream, interval).await;
                });
            }
            Err(e) => {
                error!("Failed to accept connection: {:?}", e);
            }
        }
    }
}
