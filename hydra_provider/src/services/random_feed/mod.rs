use std::sync::Arc;

use axum::{extract::State, http::StatusCode, response::IntoResponse, routing, Router};
use log::{trace};
use tokio::sync::{mpsc::Sender, Mutex};
use utoipa::OpenApi;

mod util;

use crate::hydra_input::HydraInput;
use util::random_hydra_input;

#[derive(OpenApi)]
#[openapi(paths(start_random_feed, stop_random_feed, get_random_feed_status))]
pub struct RandomFeedAPI;

struct RandomFeedState {
    random_tx: Sender<HydraInput>,
    run_task: Option<tokio::task::JoinHandle<()>>,
}

type Store = Mutex<RandomFeedState>;

pub fn router(message_tx: Sender<HydraInput>) -> Router {
    let store = Arc::new(Mutex::new(RandomFeedState {
        random_tx: message_tx,
        run_task: None,
    }));

    Router::new()
        .route("/start", routing::post(start_random_feed))
        .route("/stop", routing::post(stop_random_feed))
        .route("/status", routing::get(get_random_feed_status))
        .with_state(store)
}

#[utoipa::path(
	post,
	path = "/start",
	description = "Starts the random feed",
	responses(
		(status = StatusCode::OK, body = String),
		(status = StatusCode::CONFLICT, body = String),
	)
)]
async fn start_random_feed(State(store): State<Arc<Store>>) -> impl IntoResponse {
    trace!("Received request to start random feed");
    let mut store_v = store.lock().await;

    if store_v.run_task.is_some() {
        return (StatusCode::CONFLICT, "Random feed already running").into_response();
    }

    let task_store = store.clone();
    store_v.run_task = Some(tokio::spawn(async move {
        loop {
            let message = random_hydra_input();
            let store = task_store.lock().await;
            store.random_tx.send(message).await.unwrap();
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
    }));

    (StatusCode::OK, "Random feed started").into_response()
}

#[utoipa::path(
	post,
	path = "/stop",
	description = "Stops the random feed",
	responses(
		(status = StatusCode::OK, body = String),
		(status = StatusCode::CONFLICT, body = String),
	)
)]
async fn stop_random_feed(State(store): State<Arc<Store>>) -> impl IntoResponse {
    trace!("Received request to stop random feed");
    let mut state = store.lock().await;
    if !state.run_task.is_some() {
        return (StatusCode::CONFLICT, "Random feed already stopped").into_response();
    }

    // Clean up the feed
    if let Some(task) = state.run_task.take() {
        task.abort();
    }
    state.run_task = None;

    (StatusCode::OK, "Random feed stopped").into_response()
}

#[utoipa::path(
	get,
	path = "/status",
	description = "Gets the status of the random feed",
	responses(
		(status = StatusCode::OK, body = bool),
	)
)]
async fn get_random_feed_status(State(store): State<Arc<Store>>) -> impl IntoResponse {
    trace!("Received request to get random feed status");
    let state = store.lock().await;

    let status = state.run_task.is_some();
    (StatusCode::OK, status.to_string()).into_response()
}
