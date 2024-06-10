mod command_service;
mod database_service;
mod hydra_input;
mod services;
use axum::Router;
use clap::Parser;
use database_service::service::DatabaseService;

use log::error;
use log::info;

use std::{str::FromStr, sync::Arc};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct CliArgs {
    // Port to serve the HTTP server on
    #[arg(short, long, default_value_t = 3000)]
    port: u32,

    // Postgres DB Address
    #[arg(
		short,
		long = "db",
		default_value_t = String::from_str("postgres://postgres:postgres@localhost:5432/postgres").unwrap()
	)]
    database_address: String,
}

#[derive(OpenApi)]
#[openapi(
    nest(
        (path = "/random_feed", api = services::random_feed::RandomFeedAPI),
        (path = "/serial_feed", api = services::serial_feed::SerialFeedAPI),
    ),
    tags(
        (name = "services::random_feed", description = "Random Feed API"),
        (name = "services::serial_feed", description = "Serial Feed API")
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    env_logger::init();
    let args = CliArgs::parse();

    let (tx, mut rx) = tokio::sync::mpsc::channel(100);

    let app = Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .nest("/random_feed", services::random_feed::router(tx.clone()))
        .nest("/serial_feed", services::serial_feed::router(tx.clone()));

    let db: Arc<DatabaseService> =
        Arc::new(DatabaseService::new(args.database_address.as_str()).await);
    // TODO: Redirect tx to db or some broadcast channel (eg logging)
    tokio::spawn(async move {
        while let Some(message) = rx.recv().await {
            let msg_clone = message.clone();
            let db = db.clone();
            tokio::spawn(async move {
                let transaction_status = db.save(msg_clone).await;
                if transaction_status.is_err() {
                    error!("Error saving message: {:?}", transaction_status.err());
                    // TODO: Send to a recovery channel (either try again or save to disk or log)
                }
            });
        }
    });

    info!("Starting server on port: {}", args.port);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", args.port))
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}
