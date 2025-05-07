use clap::Parser;
use libsql::Builder;
use tracing::{info, Level};
use tracing_subscriber;

// Declare modules
pub mod command_queue;
pub mod service_ping;

pub const SERVICE_ID: &str = "heartbeat";

#[derive(Parser, Debug)]
#[command(version, about = "Periodically queues a 'Ping' command in the database.", long_about = None)]
struct Args {
    /// LibSQL server URL (e.g., http://localhost:8080, wss://your-db.turso.io)
    #[arg(long)]
    libsql_url: String,

    /// Optional LibSQL authentication token.
    #[arg(long)]
    libsql_auth_token: Option<String>,

    /// Interval between sending ping commands to the database (in seconds)
    #[arg(long, default_value_t = 10)]
    interval_secs: u64,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();

    let args = Args::parse();
    let auth_token = args.libsql_auth_token.clone().unwrap_or_default();

    info!(
        "Heartbeat service starting. Service ID: {}, Ping Interval: {}s, DB: {}, Auth Token Used: {}",
        SERVICE_ID, args.interval_secs, args.libsql_url, !auth_token.is_empty()
    );

    // Spawn the service health ping task
    let health_db_url = args.libsql_url.clone();
    let auth_token_for_ping_task = auth_token.clone();
    tokio::spawn(async move {
        service_ping::run_service_ping_task(health_db_url, auth_token_for_ping_task).await;
    });

    // Establish database connection for OutgoingCommands
    let main_db_conn: libsql::Connection = Builder::new_remote(args.libsql_url.clone(), auth_token)
        .build()
        .await?
        .connect()?;
    info!("Successfully connected to database for queuing commands.");

    command_queue::run_command_queue_loop(main_db_conn, args.interval_secs).await
}
