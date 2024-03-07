use std::net::SocketAddr;
use std::sync::Arc;

// use crate::commands::service::CommandService;
use crate::data_feed_service::random::{RandomDataFeedServer, RandomDataFeedService};
use crate::data_feed_service::serial::{SerialDataFeedServer, SerialDataFeedService};
use crate::database_service::service::DatabaseService;

use tonic::transport::Server;
use tonic_health::pb::health_server::HealthServer;
use tonic_health::server::health_reporter;
use tonic_health::server::HealthService;

// Sets up the gRPC server and loads relevant services
pub async fn bootstrap(server_port: u32, database_address: String) -> () {
    let server_address: SocketAddr = format!("[::1]:{}", server_port).parse().unwrap();

    let database_service = Arc::new(DatabaseService::new(&database_address.as_str()).await);
    let serial_data_feed_service = SerialDataFeedService::new(Arc::clone(&database_service));
    let random_data_feed_service = RandomDataFeedService::new(Arc::clone(&database_service));

    let (mut health_reporter, health_service) = health_reporter();

    health_reporter
        .set_serving::<HealthServer<HealthService>>()
        .await;

    let _ = Server::builder()
        .add_service(health_service)
        .add_service(SerialDataFeedServer::new(serial_data_feed_service))
        .add_service(RandomDataFeedServer::new(random_data_feed_service))
        .serve(server_address)
        .await;
}
