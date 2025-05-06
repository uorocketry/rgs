use axum::{
    extract::State,
    routing::{get, post},
    http::StatusCode,
    response::IntoResponse,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tokio::sync::{Mutex, MutexGuard};
use std::sync::Arc;
use tokio::process::{Child, Command};
use std::process::Stdio;
use std::env;
use std::path::PathBuf;
use tokio::signal;
use tokio::io::AsyncBufReadExt;
use tracing::{error, info, warn};

// --- Configuration Structs for API Payloads ---
#[derive(Deserialize, Debug, Clone)]
enum ServiceType {
    SerGW, // Renamed from Gateway
    Hydrand, // Renamed from Random
}

#[derive(Deserialize, Debug)]
struct StartRequest {
    service_type: ServiceType,
    // SerGW params
    serial_port: Option<String>,
    baud_rate: Option<u32>,
    // Hydrand params
    interval: Option<u64>,
    libsql_url: Option<String>, // For Hydrand's heartbeat
    // Common params for output TCP server (used by both sergw and hydrand)
    output_tcp_address: Option<String>,
    output_tcp_port: Option<u16>,
}

#[derive(Serialize, Debug)]
struct StatusResponse {
    active_service: Option<String>,
    details: Option<String>,
    message: String,
}

// --- Application State ---
struct AppState {
    current_process: Option<Child>,
    active_service_type: Option<ServiceType>,
    active_service_details: Option<String>,
    executable_base_path: PathBuf,
}

impl AppState {
    fn new() -> Result<Self, std::io::Error> {
        let mut exe_path = env::current_exe()?;
        exe_path.pop(); // Get the directory of the manager daemon
        info!("Daemon executable directory: {}", exe_path.display());
        Ok(AppState {
            current_process: None,
            active_service_type: None,
            active_service_details: None,
            executable_base_path: exe_path,
        })
    }

    async fn stop_current_service(&mut self) -> Result<(), String> {
        if let Some(mut child) = self.current_process.take() {
            let child_pid = child.id().map_or_else(|| "unknown".to_string(), |id| id.to_string());
            info!("Attempting to stop currently active service (PID: {})...", child_pid);
            
            match child.start_kill() {
                Ok(_) => {
                    info!("Kill signal sent to process (PID: {}). Waiting for exit...", child_pid);
                    match child.wait().await {
                        Ok(status) => info!("Previously active service (PID: {}) stopped with status: {}.", child_pid, status),
                        Err(e) => warn!("Error waiting for previously active service (PID: {}) to exit: {}. It might have been killed abruptly.", child_pid, e),
                    };
                    self.active_service_type = None;
                    self.active_service_details = None;
                    info!("Stopped previously active service (PID: {}).", child_pid);
                    Ok(())
                }
                Err(e) => {
                    error!("Failed to send kill signal to existing process (PID: {}): {}", child_pid, e);
                    self.current_process = Some(child);
                    Err(format!("Failed to kill existing process (PID: {}): {}", child_pid, e))
                }
            }
        } else {
            Ok(())
        }
    }

    async fn start_new_service(&mut self, req: &StartRequest) -> Result<String, String> {
        self.stop_current_service().await?;

        let mut cmd: Command;
        let service_name_str: String;
        let exe_to_run_path: PathBuf; // Store the path for error reporting
        let mut details = Vec::new();

        match req.service_type {
            ServiceType::SerGW => {
                service_name_str = "sergw".to_string();
                exe_to_run_path = self.executable_base_path.join(&service_name_str);
                info!("Preparing to start {} from {}", service_name_str, exe_to_run_path.display());
                cmd = Command::new(&exe_to_run_path);

                let serial = req.serial_port.as_ref().ok_or_else(|| "Missing serial_port for SerGW".to_string())?;
                let baud = req.baud_rate.unwrap_or(57600);
                let host_addr = req.output_tcp_address.as_deref().unwrap_or("127.0.0.1");
                let host_port = req.output_tcp_port.unwrap_or(5656);

                cmd.arg("--serial").arg(serial);
                cmd.arg("--baud").arg(baud.to_string());
                cmd.arg("--host").arg(format!("{}:{}", host_addr, host_port));

                details.push(format!("Serial: {}", serial));
                details.push(format!("Baud: {}", baud));
                details.push(format!("Output TCP: {}:{}", host_addr, host_port));
            }
            ServiceType::Hydrand => {
                service_name_str = "hydrand".to_string();
                exe_to_run_path = self.executable_base_path.join(&service_name_str);
                info!("Preparing to start {} from {}", service_name_str, exe_to_run_path.display());
                cmd = Command::new(&exe_to_run_path);

                let interval = req.interval.unwrap_or(100);
                let addr = req.output_tcp_address.as_deref().unwrap_or("127.0.0.1");
                let port = req.output_tcp_port.unwrap_or(5656);

                cmd.arg("--interval").arg(interval.to_string());
                cmd.arg("--address").arg(addr);
                cmd.arg("--port").arg(port.to_string());

                if let Some(libsql_url) = &req.libsql_url {
                    cmd.arg("--libsql-url").arg(libsql_url);
                    details.push(format!("LibSQL URL for Heartbeat: {}", libsql_url));
                }
                details.push(format!("Interval: {}ms", interval));
                details.push(format!("Output TCP: {}:{}", addr, port));
            }
        }
        info!("Executing command: {:?}", cmd);

        cmd.stdout(Stdio::piped()).stderr(Stdio::piped());
        cmd.kill_on_drop(true);

        match cmd.spawn() {
            Ok(mut child) => {
                let child_pid_str = child.id().map_or_else(|| "unknown".to_string(), |id| id.to_string());
                info!("Successfully started {} with PID: {}", service_name_str, child_pid_str);

                if let Some(stdout) = child.stdout.take() {
                    let service_name_clone = service_name_str.clone();
                    let pid_clone = child_pid_str.clone();
                    tokio::spawn(async move {
                        let reader = tokio::io::BufReader::new(stdout);
                        let mut lines = reader.lines();
                        while let Ok(Some(line)) = lines.next_line().await {
                            info!("[{}(PID: {}) STDOUT]: {}", service_name_clone, pid_clone, line);
                        }
                    });
                }
                if let Some(stderr) = child.stderr.take() {
                    let service_name_clone = service_name_str.clone();
                    let pid_clone = child_pid_str.clone();
                    tokio::spawn(async move {
                        let reader = tokio::io::BufReader::new(stderr);
                        let mut lines = reader.lines();
                        while let Ok(Some(line)) = lines.next_line().await {
                            warn!("[{}(PID: {}) STDERR]: {}", service_name_clone, pid_clone, line);
                        }
                    });
                }

                self.current_process = Some(child);
                self.active_service_type = Some(req.service_type.clone());
                self.active_service_details = Some(details.join(", "));
                Ok(format!("Successfully started {} (PID: {})", service_name_str, child_pid_str))
            }
            Err(e) => {
                let exe_name_for_error = exe_to_run_path.to_string_lossy().into_owned();
                let msg = format!("Failed to start process '{} ({})'. Error: {}. Make sure the binary exists at the expected location.", service_name_str, exe_name_for_error, e);
                error!("{}", msg);
                Err(msg)
            }
        }
    }
}

// --- Axum Handlers ---
#[axum::debug_handler]
async fn start_service_handler(
    State(state): State<Arc<Mutex<AppState>>>,
    Json(payload): Json<StartRequest>,
) -> impl IntoResponse {
    info!("Received start request: {:?}", payload);
    let mut app_state = state.lock().await;
    match app_state.start_new_service(&payload).await {
        Ok(message) => (StatusCode::OK, Json(StatusResponse {
            active_service: app_state.active_service_type.as_ref().map(|s| format!("{:?}",s)),
            details: app_state.active_service_details.clone(),
            message,
        })),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(StatusResponse {
            active_service: app_state.active_service_type.as_ref().map(|s| format!("{:?}",s)),
            details: app_state.active_service_details.clone(),
            message: e,
        })),
    }
}

#[axum::debug_handler]
async fn stop_service_handler(
    State(state): State<Arc<Mutex<AppState>>>,
) -> impl IntoResponse {
    info!("Received stop request");
    let mut app_state = state.lock().await;
    match app_state.stop_current_service().await {
        Ok(_) => (StatusCode::OK, Json(StatusResponse {
            active_service: None, details: None, message: "Service stopped successfully.".to_string()
        })),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(StatusResponse {
            active_service: app_state.active_service_type.as_ref().map(|s| format!("{:?}",s)),
            details: app_state.active_service_details.clone(),
            message: e,
        })),
    }
}

#[axum::debug_handler]
async fn get_status_handler(
    State(state): State<Arc<Mutex<AppState>>>,
) -> impl IntoResponse {
    info!("Received status request");
    let mut app_state = state.lock().await;
    
    let (active_service_str, _details_str) = // Prefix details_str with _ as it's not used directly here
        if let Some(service_type) = &app_state.active_service_type {
            (Some(format!("{:?}", service_type)), app_state.active_service_details.clone())
        } else {
            (None, None)
        };

    let mut message = "No service is active.".to_string();
    if let Some(child_process) = app_state.current_process.as_mut() {
        let pid_str = child_process.id().map_or_else(|| "unknown".to_string(), |id| id.to_string());
        let service_name_for_msg = active_service_str.as_deref().unwrap_or("Unknown");

        match child_process.try_wait() {
            Ok(Some(status)) => {
                message = format!("Service {} (PID: {}) has exited with status {}. Please check logs.", service_name_for_msg, pid_str, status);
                app_state.current_process = None;
                app_state.active_service_type = None;
                app_state.active_service_details = None;
            }
            Ok(None) => {
                message = format!("Service {} (PID: {}) is active.", service_name_for_msg, pid_str);
            }
            Err(e) => {
                message = format!("Error checking status for {} (PID: {}): {}. Assuming exited or inaccessible.", service_name_for_msg, pid_str, e);
                app_state.current_process = None;
                app_state.active_service_type = None;
                app_state.active_service_details = None;
            }
        }
    }

    Json(StatusResponse {
        active_service: app_state.active_service_type.as_ref().map(|s| format!("{:?}",s)),
        details: app_state.active_service_details.clone(), // Use the state's details which might have been updated
        message,
    })
}

#[axum::debug_handler] // Add to root_handler as well for consistency, though less likely to cause trait issues
async fn root_handler() -> impl IntoResponse {
    (StatusCode::OK, "Hydra Manager Daemon is running. Use API endpoints to control services.")
}

async fn graceful_shutdown_handler(state_arc: Arc<Mutex<AppState>>) {
    let ctrl_c = async {
        signal::ctrl_c().await.expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install terminate signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {info!("Ctrl+C received, initiating shutdown...")},
        _ = terminate => {info!("Terminate signal received, initiating shutdown...")},
    }
    
    let mut state = state_arc.lock().await;
    if state.current_process.is_some() {
        info!("Stopping active service due to shutdown...");
        if let Err(e) = state.stop_current_service().await {
            error!("Error stopping service during shutdown: {}", e);
        }
    } else {
        info!("No active service to stop during shutdown.");
    }
    info!("Shutdown complete.");
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let initial_state = AppState::new().expect("Failed to initialize application state");
    let app_state_arc = Arc::new(Mutex::new(initial_state));

    let app = Router::new()
        .route("/", get(root_handler))
        .route("/service/start", post(start_service_handler))
        .route("/service/stop", post(stop_service_handler))
        .route("/service/status", get(get_status_handler))
        .with_state(app_state_arc.clone());

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3030));
    info!("Hydra Manager Daemon listening on http://{}", addr);

    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .with_graceful_shutdown(graceful_shutdown_handler(app_state_arc.clone()))
        .await
        .unwrap();
}
