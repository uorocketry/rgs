mod connection_manager;
mod heartbeat;
mod message_handler;
mod savers;

use clap::Parser;
use tracing::Level;
use tracing_subscriber;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    // database url
    #[arg(long, default_value = "http://localhost:8080")]
    libsql_url: String,

    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();

    let args = Args::parse();

    // Start heartbeat task
    tokio::spawn(heartbeat::run_heartbeat_task(args.libsql_url.clone()));

    // Establish database connection
    let db_connection = connection_manager::connect_to_database(args.libsql_url).await?;

    // Establish MAVLink connection
    let mavlink_connection = connection_manager::connect_to_mavlink(&args.address, args.port)?;

    // Handle messages
    message_handler::handle_messages(mavlink_connection, db_connection).await
}
