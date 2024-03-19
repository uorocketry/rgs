use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Mutex;

// use crate::commands::service::CommandService;
use crate::data_feed_service::serial::{SerialDataFeedService, SerialDataFeedServer};
use crate::data_feed_service::random::{RandomDataFeedService, RandomDataFeedServer};
use crate::database_service::DatabaseService;
use crate::utils::logging::log_request;

use tonic::transport::Server;
use tonic_health::server::health_reporter;
use tonic_health::pb::health_server::HealthServer;
use tonic_health::server::HealthService;

// Sets up the gRPC server and loads relevant services
pub async fn bootstrap(
	server_port: u32,
	database_address: String,
) -> Result<(), tonic::transport::Error> {
	let server_address: SocketAddr = format!("[::1]:{}", server_port).parse().unwrap();

	let database_service = Arc::new(Mutex::new(DatabaseService::new(&database_address.as_str()).await));
	let serial_data_feed_service = SerialDataFeedService::new(database_service.clone());
	let random_data_feed_service = RandomDataFeedService::new(database_service.clone());

	let (
		mut health_reporter, 
		health_server
	) = health_reporter();

	health_reporter.set_serving::<HealthServer<HealthService>>().await;

	println!("gRPC Server running at {}", server_address);
	Server::builder()
		.add_service(health_server)
		.add_service(SerialDataFeedServer::with_interceptor(serial_data_feed_service, log_request))
		.add_service(RandomDataFeedServer::with_interceptor(random_data_feed_service, log_request))
		.serve(server_address)
		.await
}
