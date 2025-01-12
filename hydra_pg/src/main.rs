use clap::Parser;
use hydra_input::saveable::SaveableData;
use mavlink::connect;
use mavlink::uorocketry::MavMessage;
use messages::RadioMessage;
use postcard::from_bytes;
use sqlx::{query, PgPool};
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
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
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

    info!("Getting Messages...");
    let mut last_seq_num = 0;
    loop {
        let db_connection = db_connection.clone();
        match connection.recv() {
            Ok((header, message)) => {
                let packets_lost =
                    ((header.sequence as i32) - (last_seq_num as i32) - 1).rem_euclid(256);
                last_seq_num = header.sequence;

                let db_connection_clone = db_connection.clone();
                if packets_lost > 0 {
                    println!("Packets Lost: {}", packets_lost);
                    tokio::spawn(async move {
                        let mut transaction = db_connection_clone.begin().await.unwrap();
                        let result = query!(
                            "INSERT INTO packet_lost
                                (packets_lost)
                                VALUES ($1)
                                RETURNING id",
                            packets_lost
                        )
                        .fetch_one(&mut *transaction)
                        .await;
                        transaction.commit().await.unwrap();
                    });
                }

                match &message {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        let data: RadioMessage = match from_bytes(data.message.as_slice()) {
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
                        let msg_json = serde_json::to_string(&data.data).unwrap();
                        let db_connection_clone = db_connection.clone();
                        info!("\nMessage: {}", msg_json);
                        tokio::spawn(async move {
                            let mut transaction = db_connection_clone.begin().await.unwrap();
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
                        error!("Mavread Failed to receive message, REASON: {:?}", io_err);
                    }
                },
                e => {
                    panic!("Failed to receive message, REASON: {:?}", e);
                }
            },
        }
    }
}
