mod database_service;
mod command_service;
mod data_feed_service;
mod bootstrap;
mod hydra_input;

use std::str::FromStr;

use bootstrap::bootstrap;
use clap::Parser;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct CliArgs {
	// Port to serve the gRPC server on
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

#[tokio::main]
async fn main() {
	let args = CliArgs::parse();
	bootstrap(
		args.port,
		args.database_address
	).await;
}