use axum::{
    extract::{Json, State},
    http::StatusCode,
    routing::{get, post},
    Router,
};
use chrono::Local;
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::net::SocketAddr;
use std::process::Command;
use std::sync::{Arc, Mutex};
use tokio::task::JoinHandle;
use tracing::{error, info, instrument, warn}; // Added for timestamps

const MAX_LOG_LINES: usize = 50;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct ServiceInfo {
    name: String,
    details: String,
    // pid: Option<u32>, // Keep if you plan to use PIDs for stopping
}

#[derive(Serialize, Deserialize, Debug)]
enum ServiceType {
    SerGW,
    Hydrand,
}

#[derive(Deserialize, Debug)]
struct StartServicePayload {
    service_type: ServiceType,
    serial_port: Option<String>,
    baud_rate: Option<u32>,
    interval: Option<u64>,
    #[serde(rename = "libsql_url")]
    libsql_url: Option<String>,
    output_tcp_address: String,
    output_tcp_port: u16,
}

#[derive(Serialize, Debug)]
struct ServiceStatus {
    message: String,
    active_service: Option<String>,
    details: Option<String>,
}

#[derive(Clone)]
struct AppState {
    active_service_handle: Arc<Mutex<Option<JoinHandle<()>>>>,
    current_service_info: Arc<Mutex<Option<ServiceInfo>>>,
    log_store: Arc<Mutex<VecDeque<String>>>, // Added log store
}

impl AppState {
    fn new() -> Self {
        Self {
            active_service_handle: Arc::new(Mutex::new(None)),
            current_service_info: Arc::new(Mutex::new(None)),
            log_store: Arc::new(Mutex::new(VecDeque::with_capacity(MAX_LOG_LINES))),
        }
    }

    // Method to add a log entry
    fn add_log(&self, message: String) {
        let mut store = self.log_store.lock().unwrap();
        let timestamped_message =
            format!("[{}] {}", Local::now().format("%Y-%m-%d %H:%M:%S"), message);

        // Keep original tracing macros for structured logging to console/files if configured
        // The log_store is primarily for the web UI
        info!("UI_LOG: {}", message); // Using info! as a placeholder, adjust level as needed

        if store.len() >= MAX_LOG_LINES {
            store.pop_front();
        }
        store.push_back(timestamped_message);
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app_state = AppState::new();
    app_state.add_log("Hydra Manager Daemon starting up...".to_string());

    let app = Router::new()
        .route("/", get(root_handler))
        .route("/service/start", post(start_new_service_handler))
        .route("/service/stop", post(stop_service_handler))
        .route("/service/status", get(get_service_status_handler))
        .route("/logs", get(get_logs_handler)) // Added logs route
        .with_state(app_state.clone());

    let addr_str = "0.0.0.0:3030";
    let addr: SocketAddr = addr_str.parse().expect("Failed to parse address");

    app_state.add_log(format!("Daemon listening on {}", addr_str));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[instrument(skip(state))]
async fn root_handler(State(state): State<AppState>) -> String {
    state.add_log("Root endpoint was accessed.".to_string());
    "Hydra Manager Daemon is running!".to_string()
}

#[derive(Serialize)]
struct LogsResponse {
    logs: Vec<String>,
}

#[instrument(skip(state))]
async fn get_logs_handler(State(state): State<AppState>) -> Json<LogsResponse> {
    let store = state.log_store.lock().unwrap();
    Json(LogsResponse {
        logs: store.iter().cloned().collect(),
    })
}

#[instrument(skip(state, payload))]
async fn start_new_service_handler(
    State(state): State<AppState>,
    Json(payload): Json<StartServicePayload>,
) -> (StatusCode, Json<ServiceStatus>) {
    state.add_log(format!(
        "Received start request for service: {:?}",
        payload.service_type
    ));

    let mut handle_guard = state.active_service_handle.lock().unwrap();
    if handle_guard.is_some() {
        state.add_log(
            "Attempted to start a new service while another is already running.".to_string(),
        );
        return (
            StatusCode::CONFLICT,
            Json(ServiceStatus {
                message: "A service is already running. Please stop it first.".to_string(),
                active_service: state
                    .current_service_info
                    .lock()
                    .unwrap()
                    .as_ref()
                    .map(|si| si.name.clone()),
                details: state
                    .current_service_info
                    .lock()
                    .unwrap()
                    .as_ref()
                    .map(|si| si.details.clone()),
            }),
        );
    }

    let service_name_for_status = format!("{:?}", payload.service_type);
    let service_details_for_status = match payload.service_type {
        ServiceType::SerGW => format!(
            "SerGW - Serial: {}, Baud: {}, Host: {}:{}",
            payload.serial_port.as_deref().unwrap_or("N/A"),
            payload
                .baud_rate
                .map_or("N/A".to_string(), |b| b.to_string()),
            payload.output_tcp_address,
            payload.output_tcp_port
        ),
        ServiceType::Hydrand => format!(
            "Hydrand - Interval: {}ms, LibSQL: {}, Host: {}:{}",
            payload
                .interval
                .map_or("N/A".to_string(), |i| i.to_string()),
            payload.libsql_url.as_deref().unwrap_or("N/A"),
            payload.output_tcp_address,
            payload.output_tcp_port
        ),
    };

    let state_clone = state.clone();
    let service_info_for_task = ServiceInfo {
        name: service_name_for_status.clone(),
        details: service_details_for_status.clone(),
    };

    let handle = tokio::spawn(async move {
        let mut cmd = match payload.service_type {
            ServiceType::SerGW => {
                let mut command = Command::new("./target/debug/sergw"); // Ensure this path is correct
                command.arg("listen"); // Added "listen" subcommand
                if let Some(serial_port) = payload.serial_port {
                    command.arg("--serial").arg(serial_port);
                }
                if let Some(baud_rate) = payload.baud_rate {
                    command.arg("--baud").arg(baud_rate.to_string());
                }
                command.arg("--host").arg(format!(
                    "{}:{}",
                    payload.output_tcp_address, payload.output_tcp_port
                ));
                command
            }
            ServiceType::Hydrand => {
                let mut command = Command::new("./target/debug/hydrand"); // Ensure this path is correct
                if let Some(interval) = payload.interval {
                    command.arg("--interval").arg(interval.to_string());
                }
                if let Some(libsql_url) = payload.libsql_url {
                    command.arg("--libsql-url").arg(libsql_url);
                }
                command
            }
        };

        state_clone.add_log(format!(
            "Attempting to start {} with command: {:?}",
            service_info_for_task.name, cmd
        ));

        match cmd.status() {
            Ok(status) => {
                if status.success() {
                    state_clone.add_log(format!(
                        "Service {} finished successfully.",
                        service_info_for_task.name
                    ));
                } else {
                    state_clone.add_log(format!(
                        "Service {} exited with status: {}. Check daemon logs for more details.",
                        service_info_for_task.name, status
                    ));
                    // Attempt to capture stderr if available
                    // This part is tricky with std::process::Command and async,
                    // consider tokio::process::Command for better output handling.
                }
            }
            Err(e) => {
                state_clone.add_log(format!(
                    "Failed to start service {}: {}",
                    service_info_for_task.name, e
                ));
                error!(
                    "Failed to start service {}: {}",
                    service_info_for_task.name, e
                );
            }
        }
        // Clear service info when task ends
        let mut info_guard = state_clone.current_service_info.lock().unwrap();
        *info_guard = None;
        let mut handle_guard_task_end = state_clone.active_service_handle.lock().unwrap(); //
        *handle_guard_task_end = None; // Clear the handle itself from within the task upon completion
        state_clone.add_log(format!(
            "Service task for {} ended.",
            service_info_for_task.name
        ));
    });

    *handle_guard = Some(handle);
    let mut current_info_guard = state.current_service_info.lock().unwrap();
    *current_info_guard = Some(ServiceInfo {
        name: service_name_for_status.clone(),
        details: service_details_for_status,
    });

    state.add_log(format!(
        "Service {} start process initiated.",
        service_name_for_status
    ));

    (
        StatusCode::OK,
        Json(ServiceStatus {
            message: format!("Service {} starting...", service_name_for_status),
            active_service: Some(service_name_for_status),
            details: current_info_guard.as_ref().map(|si| si.details.clone()),
        }),
    )
}

#[instrument(skip(state))]
async fn stop_service_handler(State(state): State<AppState>) -> (StatusCode, Json<ServiceStatus>) {
    state.add_log("Received request to stop active service.".to_string());
    let mut handle_guard = state.active_service_handle.lock().unwrap();
    let mut current_info_guard = state.current_service_info.lock().unwrap();

    if let Some(handle) = handle_guard.take() {
        handle.abort(); // Send abort signal
                        // Note: Aborting a JoinHandle doesn't directly kill the spawned OS process.
                        // True process killing needs OS-specific calls (e.g., using PID, if stored and managed).
                        // For now, we rely on the service itself to terminate gracefully upon task cancellation if possible,
                        // or the OS to clean it up if it's a child process that exits when parent does (not always the case).

        let service_name = current_info_guard
            .as_ref()
            .map_or("Unknown".to_string(), |si| si.name.clone());
        *current_info_guard = None; // Clear current service info

        state.add_log(format!(
            "Abort signal sent to service task: {}",
            service_name
        ));
        (
            StatusCode::OK,
            Json(ServiceStatus {
                message: format!(
                    "Stop signal sent to service {}. It might take a moment to terminate.",
                    service_name
                ),
                active_service: None,
                details: None,
            }),
        )
    } else {
        state.add_log("No active service found to stop.".to_string());
        (
            StatusCode::NOT_FOUND,
            Json(ServiceStatus {
                message: "No active service was running.".to_string(),
                active_service: None,
                details: None,
            }),
        )
    }
}

#[instrument(skip(state))]
async fn get_service_status_handler(State(state): State<AppState>) -> Json<ServiceStatus> {
    // state.add_log("Service status requested.".to_string()); // Can be verbose, enable if needed
    let info_guard = state.current_service_info.lock().unwrap();
    if let Some(info) = &*info_guard {
        Json(ServiceStatus {
            message: "Service is running.".to_string(),
            active_service: Some(info.name.clone()),
            details: Some(info.details.clone()),
        })
    } else {
        Json(ServiceStatus {
            message: "No service is currently running.".to_string(),
            active_service: None,
            details: None,
        })
    }
}
