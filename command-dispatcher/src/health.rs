use libsql::{Connection, params as libsql_params};
use std::time::Duration;
use chrono::Utc;
use tracing::{info, warn};
use hostname;

pub async fn run_service_status_task(db_conn: Connection) -> Result<(), Box<dyn std::error::Error>> {
    let hostname_str_orig = hostname::get()
        .map(|s| s.into_string().unwrap_or_else(|_| "invalid_hostname".to_string()))
        .unwrap_or_else(|_| "unknown_hostname".to_string());
    
    let service_instance_id_orig = format!("rgs-command-dispatcher@{}-{}", hostname_str_orig, std::process::id());
    let start_time_ts = Utc::now().timestamp();
    let service_name = "rgs-command-dispatcher";

    info!(
        "Service status task started for instance: {}. Update interval: 15s",
        service_instance_id_orig
    );

    loop {
        let current_timestamp = Utc::now().timestamp();
        let status_message = "Running and polling DB for commands".to_string(); 
        let current_status = "Running";

        let service_instance_id_clone = service_instance_id_orig.clone();
        let hostname_str_clone = hostname_str_orig.clone();

        let result = db_conn.execute(
            "INSERT INTO ServiceStatus (service_instance_id, service_name, hostname, status, status_message, last_heartbeat_at, start_time) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) \
             ON CONFLICT(service_instance_id) DO UPDATE SET service_name=excluded.service_name, hostname=excluded.hostname, status=excluded.status, status_message=excluded.status_message, last_heartbeat_at=excluded.last_heartbeat_at",
            libsql_params![
                service_instance_id_clone, 
                service_name,              
                hostname_str_clone,        
                current_status,            
                status_message,            
                current_timestamp,
                start_time_ts, 
            ],
        ).await;

        if let Err(e) = result {
            warn!(
                "Failed to update ServiceStatus for {}: DB Error: {}",
                service_instance_id_orig, e 
            );
        } 

        tokio::time::sleep(Duration::from_secs(15)).await;
    }
    // Unreachable code
    // Ok(())
} 