use crate::SERVICE_ID; // To access the SERVICE_ID from main.rs
use hostname;
use libsql::{params, Builder};
use std::time::SystemTime;
use tokio::time::{sleep, Duration};
use tracing::{info, warn};

const HEALTH_PING_INTERVAL_SECS: u64 = 30;

pub async fn run_service_ping_task(db_url: String, auth_token: String) {
    let host_name = hostname::get()
        .map(|s| {
            s.into_string()
                .unwrap_or_else(|_| "invalid_hostname".to_string())
        })
        .unwrap_or_else(|_| "unknown_hostname".to_string());

    info!(
        "ServicePing task started for service_id '{}'. Will ping DB at {} (auth token used: {}) every {}s. Hostname: {}",
        SERVICE_ID, db_url, !auth_token.is_empty(), HEALTH_PING_INTERVAL_SECS, host_name
    );

    loop {
        sleep(Duration::from_secs(HEALTH_PING_INTERVAL_SECS)).await;

        let db_result = async {
            let db = Builder::new_remote(db_url.clone(), auth_token.clone())
                .build()
                .await?;
            let conn = db.connect()?;

            let app_timestamp = SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);

            info!(
                "Sending ServicePing for service_id '{}', hostname '{}'",
                SERVICE_ID, host_name
            );
            conn.execute(
                "INSERT INTO ServicePing (service_id, hostname, app_timestamp) VALUES (?1, ?2, ?3)",
                params![SERVICE_ID, host_name.clone(), app_timestamp as i64],
            )
            .await?;

            Ok::<(), Box<dyn std::error::Error + Send + Sync>>(())
        }
        .await;

        if let Err(e) = db_result {
            warn!("Failed to send ServicePing: {}", e);
        }
    }
}
