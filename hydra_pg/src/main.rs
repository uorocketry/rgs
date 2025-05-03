mod savers;
use clap::Parser;
use libsql::Builder;
use mavlink::connect;
use mavlink::uorocketry::MavMessage;
use std::time::{Duration, Instant};
use tracing::{error, info, warn};
use tracing_subscriber;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    // database url
    #[arg(short, long, default_value = "localhost:8080")]
    db_url: String,

    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let args = Args::parse();

    info!("Attempting to connect to database: {}", args.db_url);

    let db = Builder::new_remote("http://127.0.0.1:8080".to_string(), "".to_string())
        .build()
        .await
        .unwrap();

    let db_connection = match db.connect() {
        Ok(connection) => {
            info!("Database connection established successfully");
            connection
        }
        Err(e) => {
            error!(
                "Failed to connect to database, is it running? REASON: {:?}",
                e
            );
            return Err(e.into());
        }
    };

    let connection_string = format!("tcpout:{}:{}", args.address, args.port);

    info!(
        "Attempting to connect to hydra_gateway on {}",
        connection_string
    );

    let connection = match connect::<MavMessage>(&connection_string) {
        Ok(connection) => {
            info!("Successfully connected");
            connection
        }
        Err(error) => {
            error!("Failed to connect: {}", error);
            return Err(error.into());
        }
    };

    info!("Getting Messages...");
    let mut last_seq_num = 0;

    // Batching parameters
    const BATCH_SIZE: usize = 100;
    const BATCH_TIMEOUT: Duration = Duration::from_millis(500);

    let mut message_buffer: Vec<Vec<u8>> = Vec::with_capacity(BATCH_SIZE);
    let mut last_batch_time = Instant::now();

    loop {
        let mut received_would_block = false; // Flag for WouldBlock

        // Clone connection for potential batch save
        let db_conn_for_batch = db_connection.clone();

        // Store the result of recv() once per loop iteration
        let recv_result = connection.recv();

        match recv_result {
            Ok((header, message)) => {
                info!("Received message: {:?}", header.sequence);
                let packets_lost =
                    ((header.sequence as i32) - (last_seq_num as i32) - 1).rem_euclid(256);
                last_seq_num = header.sequence;

                if packets_lost > 0 {
                    warn!("Packets Lost: {}", packets_lost);
                    // TODO: adding packet loss saving logic (potentially batched too)
                }

                match message {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        message_buffer.push(data.message.to_vec());
                    }
                    MavMessage::RADIO_STATUS(_data) => {
                        // TODO: Handle RADIO_STATUS saving if needed, potentially batching it as well.
                        // warn!("Received RADIO_STATUS, saving not implemented yet.");
                        // let data = data.clone();
                        // tokio::spawn(async move { ... });
                    }
                    other => {
                        error!("Received an unexpected message type {:?}", other);
                        continue; // Skip unknown message types
                    }
                };
            }
            Err(e) => {
                match e {
                    mavlink::error::MessageReadError::Io(io_err) => match io_err.kind() {
                        std::io::ErrorKind::WouldBlock => {
                            // Ignore WouldBlock errors
                        }
                        std::io::ErrorKind::UnexpectedEof => {
                            error!("Connection closed unexpectedly (EOF). Shutting down receiver loop.");
                            break; // Exit loop on EOF
                        }
                        _ => {
                            error!("Mavlink IO Error receiving message: {:?}", io_err);
                            // Potentially break or implement retry logic?
                            tokio::time::sleep(Duration::from_secs(1)).await; // Avoid busy-looping on persistent errors
                            continue;
                        }
                    },
                    // Other non-IO errors might be more serious
                    e => {
                        error!("Mavlink Non-IO Error receiving message: {:?}", e);
                        // Depending on the error, might need to panic or break
                        tokio::time::sleep(Duration::from_secs(1)).await;
                        continue;
                    }
                }
            }
        }

        // Check if we need to save the batch
        let should_save_batch = !message_buffer.is_empty()
            && (message_buffer.len() >= BATCH_SIZE || last_batch_time.elapsed() >= BATCH_TIMEOUT);

        if should_save_batch {
            info!("Saving batch");
            // Take the messages from the buffer
            let messages_to_save = std::mem::take(&mut message_buffer);
            // Reset the timer
            last_batch_time = Instant::now();

            // Spawn a task to save the batch without blocking the receive loop
            tokio::spawn(async move {
                match savers::message::save_messages_batch(&db_conn_for_batch, messages_to_save)
                    .await
                {
                    Ok(_) => info!("Batch saved successfully."),
                    Err(e) => error!("Failed to save batch: {:?}", e),
                }
            });
            // Ensure the buffer has the correct capacity after taking elements
            message_buffer.reserve(BATCH_SIZE);
        }
    }

    Ok(())
}
