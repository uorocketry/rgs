use libsql::{Builder, Connection};
use mavlink::uorocketry::MavMessage;
use mavlink::MavConnection;
use tracing::{error, info};

pub async fn connect_to_database(db_url: String) -> Result<Connection, Box<dyn std::error::Error>> {
    info!("Attempting to connect to database: {}", db_url);
    let db = Builder::new_remote(db_url.clone(), "".to_string())
        .build()
        .await?;

    match db.connect() {
        Ok(connection) => {
            info!("Database connection established successfully");
            Ok(connection)
        }
        Err(e) => {
            error!(
                "Failed to connect to database, is it running? REASON: {:?}",
                e
            );
            Err(e.into())
        }
    }
}

pub fn connect_to_mavlink(
    address: &str,
    port: u16,
) -> Result<Box<dyn MavConnection<MavMessage> + Send + Sync>, Box<dyn std::error::Error>> {
    let connection_string = format!("tcpout:{}:{}", address, port);
    info!("Attempting to connect to MAVLink on {}", connection_string);
    match mavlink::connect::<MavMessage>(&connection_string) {
        Ok(connection) => {
            info!("Successfully connected to MAVLink");
            Ok(connection)
        }
        Err(error) => {
            error!("Failed to connect to MAVLink: {}", error);
            Err(error.into())
        }
    }
}
