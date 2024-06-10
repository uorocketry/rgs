use std::sync::Arc;

use crate::hydra_input::HydraInput;
use axum::extract::Path;
use axum::Json;
use axum::{extract::State, http::StatusCode, response::IntoResponse, routing, Router};
use log::{error, info, trace};
use messages::mavlink::connect;
use messages::mavlink::{uorocketry::MavMessage, MavConnection};
use postcard::from_bytes;
use serde::{Deserialize, Serialize};
use serialport::{available_ports, SerialPortType};
use tokio::sync::{mpsc::Sender, Mutex};
use utoipa::{OpenApi, ToSchema};

#[derive(OpenApi)]
#[openapi(
    paths(start_serial_feed, stop_serial_feed, list_ports),
    components(schemas(PortsResponse))
)]
pub struct SerialFeedAPI;

struct SerialFeedState {
    out_tx: Sender<HydraInput>,
    mavlink: Option<Box<dyn MavConnection<MavMessage> + Send + Sync>>,
    run_task: Option<tokio::task::JoinHandle<()>>,
}

type Store = Mutex<SerialFeedState>;

pub fn router(message_tx: Sender<HydraInput>) -> Router {
    let store = Arc::new(Mutex::new(SerialFeedState {
        out_tx: message_tx,
        mavlink: None,
        run_task: None,
    }));

    Router::new()
        .route("/connect/:adress", routing::post(start_serial_feed))
        .route("/disconnect", routing::post(stop_serial_feed))
        .route("/list_ports", routing::get(list_ports))
        .route("/status", routing::get(get_serial_feed_status))
        .with_state(store)
}

#[utoipa::path(
	post,
	path = "/connect/{address}",
	description = "Connects the serial feed to the specified port",
	responses(
		(status = StatusCode::OK, body = String),
		(status = StatusCode::CONFLICT, body = String),
	),
	params(
		("address" = String, Path, description = "The address to connect to")
	)
)]
async fn start_serial_feed(
    Path(address): Path<String>,
    State(store): State<Arc<Store>>,
) -> impl IntoResponse {
    trace!("Received request to start serial feed");
    let mut store_guard = store.lock().await;

    if store_guard.run_task.is_some() {
        return (StatusCode::CONFLICT, "Random feed already connected").into_response();
    }

    let connection = match connect::<MavMessage>(address.as_str()) {
        Ok(conn) => conn,
        Err(err) => {
            return (
                StatusCode::CONFLICT,
                format!("Error connecting to serial port: {}", err),
            )
                .into_response();
        }
    };

    store_guard.mavlink = Some(connection);

    let task_store = store.clone();
    store_guard.run_task = Some(tokio::spawn(async move {
        loop {
            trace!("Waiting for mavlink message");
            let state = task_store.lock().await;
            let mavlink = state.mavlink.as_ref().unwrap();
            let message = mavlink.recv();

            match message {
                Ok((_, message)) => {
                    trace!("Deserializing mavlink message");
                    let message = match &message {
                        MavMessage::POSTCARD_MESSAGE(data) => {
                            match from_bytes(data.message.as_slice()) {
                                Ok(message) => {
                                    trace!("Received rocket message: {:#?}", message);
                                    HydraInput::Message(message)
                                }
                                Err(err) => {
                                    error!("Error deserializing mavlink message: {:?}", err);
                                    continue;
                                }
                            }
                        }
                        MavMessage::RADIO_STATUS(data) => {
                            info!("Received radio status: {:?}", data);
                            HydraInput::RadioStatus(data.clone())
                        }
                        MavMessage::HEARTBEAT(heartbeat) => {
                            info!("Received heartbeat.");
                            HydraInput::Heartbeat(heartbeat.clone())
                        }
                    };
                    state.out_tx.send(message).await.unwrap();
                }
                Err(e) => {
                    error!("Error receiving mavlink message: {:?}", e);
                    // Should we stop the task? How do we know if the connection is closed?
                }
            }
        }
    }));

    (StatusCode::OK, "Random feed started").into_response()
}

#[utoipa::path(
	post,
	path = "/disconnect",
	description = "Disconnects the serial feed",
	responses(
		(status = StatusCode::OK, body = String),
		(status = StatusCode::CONFLICT, body = String),
	),
)]
async fn stop_serial_feed(State(store): State<Arc<Store>>) -> impl IntoResponse {
    trace!("Received request to stop serial feed");
    let mut store = store.lock().await;

    if !store.run_task.is_some() {
        return (StatusCode::CONFLICT, "Serial feed not connected").into_response();
    }

    if let Some(task) = store.run_task.take() {
        task.abort();
    }
    store.run_task = None;

    (StatusCode::OK, "Serial feed stopped").into_response()
}

#[derive(Serialize, Deserialize, ToSchema)]
struct PortsResponse(Vec<String>);

#[utoipa::path(
	get,
	path = "/list_ports",
	description = "Lists available serial ports",
	responses(
		(status = StatusCode::OK, body = [PortsResponse]),
	),
)]
async fn list_ports() -> Json<PortsResponse> {
    trace!("Received request to list ports");
    let maybe_ports = available_ports();
    let ports = match maybe_ports {
        Ok(ports) => ports
            .iter()
            .filter(|port| matches!(port.port_type, SerialPortType::UsbPort(_)))
            .map(|port| port.port_name.clone())
            .collect::<Vec<String>>(),
        Err(err) => {
            info!("Error listing ports: {}", err);
            vec![]
        }
    };

    return Json(PortsResponse(ports));
}

#[utoipa::path(
    get,
    path = "/status",
    description = "Gets the status of the serial feed",
    responses(
        (status = StatusCode::OK, body = String),
    ),
)]
async fn get_serial_feed_status(State(store): State<Arc<Store>>) -> impl IntoResponse {
    let store = store.lock().await;
    let status = store.run_task.is_some();
    (StatusCode::OK, status.to_string()).into_response()
}
