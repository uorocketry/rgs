use crate::SERVICE_ID; // To access the SERVICE_ID from main.rs
use chrono::Utc;
use libsql::{params, Connection};
use tokio::time::{sleep, Duration};
use tracing::{error, info, warn};

pub async fn run_command_queue_loop(
    db_conn: Connection,
    interval_secs: u64,
) -> Result<(), Box<dyn std::error::Error>> {
    info!(
        "Command queue loop started. Will queue 'Ping' every {}s.",
        interval_secs
    );

    loop {
        sleep(Duration::from_secs(interval_secs)).await;

        let current_timestamp = Utc::now().timestamp();
        let command_type = "Ping";
        let parameters: Option<String> = None;
        let status = "Pending";

        info!(
            "Attempting to queue '{}' command from service '{}'",
            command_type, SERVICE_ID
        );

        match db_conn.execute(
            "INSERT INTO OutgoingCommand (command_type, parameters, status, created_at, source_service) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![command_type, parameters, status, current_timestamp, SERVICE_ID],
        ).await {
            Ok(rows_affected) => {
                if rows_affected > 0 {
                    info!("Successfully queued '{}' command ({} rows affected).", command_type, rows_affected);
                } else {
                    warn!(
                        "Queued '{}' command, but no rows were affected. Check table structure or constraints.",
                        command_type
                    );
                }
            }
            Err(e) => {
                // For critical errors like a closed connection, it might be better to return the error
                // and let the main function decide whether to attempt a reconnect or exit.
                error!("Failed to queue '{}' command: {}. The application might need to be restarted if this persists.", command_type, e);
                // To make it attempt to exit and potentially be restarted by an orchestrator:
                // return Err(e.into()); 
            }
        }
    }
}
