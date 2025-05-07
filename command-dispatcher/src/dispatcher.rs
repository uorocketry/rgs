use crate::cli::Args;
use crate::commands::{process_single_command, OutgoingCommandRow};
use libsql::{Connection, params as libsql_params};
use mavlink::{
    connect,
    uorocketry::MavMessage,
    MavConnection,
};
use std::time::Duration;
use tracing::{error, info, warn};

pub async fn run_dispatcher(
    db_conn: Connection, 
    args: Args,          
) -> Result<(), Box<dyn std::error::Error>> {
    info!(
        "Dispatcher loop starting. Poll Interval: {}s. Gateway: {}",
        args.poll_interval_secs, args.gateway_connection_string
    );

    let mut gateway_conn_opt: Option<Box<dyn MavConnection<MavMessage> + Sync + Send>> = None;
    let gateway_connection_string = args.gateway_connection_string.clone();

    loop { 
        if gateway_conn_opt.is_none() {
            info!("Attempting to connect to gateway: {}", gateway_connection_string);
            match connect::<MavMessage>(&gateway_connection_string) {
                Ok(conn) => {
                    info!("Successfully connected to gateway.");
                    gateway_conn_opt = Some(conn);
                    // TODO: Consider logic to reset status of commands stuck in 'Sending' from a previous session/connection drop.
                }
                Err(error) => {
                    error!("Failed to connect to gateway: {}. Retrying in 5 seconds...", error);
                    gateway_conn_opt = None; 
                    tokio::time::sleep(Duration::from_secs(5)).await; 
                    continue; 
                }
            }
        }

        if let Some(ref mut current_gateway_conn) = gateway_conn_opt {
            info!("Fetching pending commands...");
            let mut stmt = match db_conn.prepare(
                "SELECT id, command_type, parameters, source_service FROM OutgoingCommand WHERE status = 'Pending' ORDER BY created_at ASC LIMIT 10"
            ).await {
                Ok(s) => s,
                Err(e) => {
                    error!("Failed to prepare DB statement: {:?}. Retrying poll cycle.", e);
                    tokio::time::sleep(Duration::from_secs(args.poll_interval_secs)).await;
                    continue; 
                }
            };
            
            let rows_result = stmt.query(libsql_params![]).await;
            let mut commands: Vec<OutgoingCommandRow> = Vec::new();
            
            match rows_result {
                Ok(mut rows) => {
                    loop {
                        match rows.next().await {
                            Ok(Some(row)) => {
                                commands.push(OutgoingCommandRow {
                                    id: row.get(0)?,
                                    command_type: row.get(1)?,
                                    parameters: row.get(2)?,
                                    source_service: row.get(3)?,
                                });
                            }
                            Ok(None) => {
                                break;
                            }
                            Err(e) => {
                                error!("Error fetching a row from database: {:?}. Processing partial batch if any.", e);
                                break;
                            }
                        }
                    }
                }
                Err(e) => {
                    error!("Failed to execute query for pending commands: {:?}. Retrying poll cycle.", e);
                    tokio::time::sleep(Duration::from_secs(args.poll_interval_secs)).await;
                    continue; 
                }
            }

            if commands.is_empty() {
                // info!("No pending commands found."); // Keep commented out info for potential debugging
            } else {
                info!("Fetched {} pending command(s). Processing...", commands.len());
                for command_row in commands {
                    let process_result = process_single_command(
                        &db_conn, 
                        current_gateway_conn, 
                        command_row
                    ).await;

                    if let Err(e) = process_result {
                        let (cmd_id, err_details) = e;
                        error!("Error processing command (ID: {}): {:?}", cmd_id, err_details);
                        let error_string = err_details.to_string().to_lowercase();
                        if error_string.contains("connection") || 
                           error_string.contains("broken pipe") || 
                           error_string.contains("os error 104") || 
                           error_string.contains("os error 32") ||  
                           error_string.contains("failed to send") 
                        {
                            warn!("Gateway connection likely lost (error: {}). Resetting connection.", err_details);
                            gateway_conn_opt = None; 
                            break; 
                        }
                    }
                }
            }
        } 
        
        if gateway_conn_opt.is_some() { 
            tokio::time::sleep(Duration::from_secs(args.poll_interval_secs)).await;
        }
    }
    // Unreachable code
    // Ok(())
} 