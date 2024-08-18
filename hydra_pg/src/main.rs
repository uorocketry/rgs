use std::any::Any;

use clap::Parser;
use hydra_input::saveable::SaveableData;
use mavlink::connect;
use mavlink::uorocketry::MavMessage;
use messages::Message;
use postcard::from_bytes;
use sqlx::PgPool;
use tracing::{error, info};
mod hydra_input;
use tracing_subscriber;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    // database url
    #[arg(
        short,
        long,
        default_value = "postgres://postgres:postgres@localhost:5432/postgres"
    )]
    db_url: String,

    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,

    // sleep time in ms
    #[arg(short, long, default_value_t = 100)]
    interval: u64,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::ERROR)
        .init();

    let args = Args::parse();

    info!("Attempting to connect to database: {}", args.db_url);
    let db_connection = match PgPool::connect(&args.db_url).await {
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

    loop {
        let db_connection = db_connection.clone();
        match connection.recv() {
            Ok((header, message)) => {
                match &message {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        let data: Message = match from_bytes(data.message.as_slice()) {
                            Ok(data) => data,
                            Err(e) => {
                                error!(
                                    "Failed to deserialize message, {:?} REASON: {:?}",
                                    header, e
                                );
                                continue;
                            }
                        };
                        let data = data.clone();
                        tokio::spawn(async move {
                            let mut transaction = db_connection.begin().await.unwrap();
                            data.save(&mut transaction, 0).await.unwrap();
                            transaction.commit().await.unwrap();
                        });
                    }
                    MavMessage::RADIO_STATUS(data) => {
                        let data = data.clone();
                        tokio::spawn(async move {
                            let mut transaction = db_connection.begin().await.unwrap();
                            data.save(&mut transaction, 0).await.unwrap();
                            transaction.commit().await.unwrap();
                        });
                    }
                    other => {
                        error!("Received an unexpected message type {:?}", other);
                        continue;
                    }
                };
            }
            Err(e) => match e {
                mavlink::error::MessageReadError::Io(io_err) => match io_err.kind() {
                    std::io::ErrorKind::WouldBlock => continue,
                    _ => {
                        error!("Failed to receive message, REASON: {:?}", io_err);
                    }
                },
                e => {
                    error!("Failed to receive message, REASON: {:?}", e);
                }
            },
        }
    }
}
