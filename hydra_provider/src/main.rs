use std::sync::Arc;

use hydra_iterator::HydraInput;
use sqlx::PgPool;
use tokio::join;
use tonic::transport::Server;
use tonic_health::pb::health_server::HealthServer;
use tonic_health::server::HealthService;
mod db;
mod input;
use crate::connection_manager::ConnectionManagerImpl;
use crate::connection_manager_server::ConnectionManagerServer;
use crate::db::db_save_hydra_input;
use crate::greeter::GreeterImpl;
use crate::greeter_server::GreeterServer;
use crate::hydra_provider_proto::hydra_provider_proto::*;
use crate::input::process_file;
use crate::input::process_random_input;
use crate::input::process_serial;
use anyhow::Result;
use clap::ArgGroup;
use clap::Parser;
use log::*;

mod connection_manager;
mod greeter;
mod hydra_iterator;
mod hydra_provider_proto;
mod rocket_command;
mod rocket_data;
mod rocket_sensor;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();
    env_logger::Builder::from_default_env()
        .filter(None, args.log)
        .init();

    if let Err(err) = run(args).await {
        error!("{:?}", err)
    }

    Ok(())
}

/// Program to read and parse data from a HYDRA system
#[derive(Parser, Debug, Clone)]
#[command(author, version, about, long_about = None)]
#[command(group(
    ArgGroup::new("input")
        .required(false)
        .args(["serial_port", "random_input"])
))]
struct Args {
    /// Serial port to read from. If not specified, the first port found will be used.
    /// Is used as default input if not other inputs are specified.
    #[arg(short, long, env, default_value = "/dev/ttyUSB0")]
    serial_port: Option<String>,

    /// Baud rate to use for the serial connection
    #[arg(short, long, env, default_value = "57600")]
    baud_rate: u32,

    /// Pocketbase port
    #[arg(short, long, env, default_value = "3001")]
    pocketbase_port: u32,

    /// Simulate a source with random data for testing
    #[arg(short, long, env, default_value = "false")]
    random_input: bool,

    // Read from file, input path
    #[arg(short, long, env, default_value = "")]
    file_input: String,

    /// Logging level
    #[arg(short, long, env, default_value = "Info")]
    log: LevelFilter,
}

async fn run(args: Args) -> Result<()> {
    let (mut health_reporter, health_service) = tonic_health::server::health_reporter();
    health_reporter
        .set_serving::<HealthServer<HealthService>>()
        .await;

    let addr = format!("[::1]:{}", args.pocketbase_port).parse().unwrap();
    let server = Server::builder()
        .add_service(health_service)
        .add_service(GreeterServer::new(GreeterImpl::default()))
        .add_service(ConnectionManagerServer::new(
            ConnectionManagerImpl::default(),
        ))
        .serve(addr);

    info!("Hydra Provider listening on {}", addr);
    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or("postgres://postgres:postgres@localhost:5432/postgres".to_string());

    info!("Connecting to database...");
    let db_client = Arc::new(PgPool::connect(&db_url).await.unwrap());
    info!("Connected to database");

    let message_receiver_handle = tokio::task::spawn_blocking(move || {
        for msg in start_input(args) {
            let db_client = db_client.clone();
            tokio::task::spawn(async move {
                db_save_hydra_input(&db_client, msg).await.unwrap();
            });
        }
    });

    let result = join!(server, message_receiver_handle);

    match result {
        (Err(e), _) => {
            error!("Server error: {}", e);
        }
        (_, Err(e)) => {
            error!("Processing error: {}", e);
        }

        _ => {}
    }

    Ok(())
}

fn start_input(args: Args) -> Box<dyn Iterator<Item = HydraInput> + Send> {
    if !args.file_input.is_empty() {
        info!("Reading from file");
        return process_file(args.file_input);
    } else if !args.random_input {
        info!("Using serial input");
        return process_serial(&args.serial_port, args.baud_rate);
    } else {
        info!("Using random input");
        return process_random_input();
    }
}
