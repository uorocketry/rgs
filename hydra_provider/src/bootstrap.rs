use std::net::SocketAddr;
use std::sync::atomic::AtomicBool;
use std::sync::Arc;
use log::info;
use mavlink::connect;
use mavlink::uorocketry::MavMessage;
use tokio::sync::Mutex;

use crate::data_feed_service::serial::iterator::SerialDataFeedIterator;
// use crate::commands::service::CommandService;
use crate::data_feed_service::serial::{ SerialDataFeedService};
use crate::database_service::DatabaseService;


// Sets up the gRPC server and loads relevant services
pub async fn bootstrap(
    server_port: u32,
    database_address: String,
){
    let server_address: SocketAddr = format!("[::1]:{}", server_port).parse().unwrap();

    let database_service = Arc::new(Mutex::new(
        DatabaseService::new(&database_address.as_str()).await,
    ));
    let serial_data_feed_service = SerialDataFeedService::new(database_service.clone());


    let address = "tcpout:127.0.0.1:5656";

    let iterator =  SerialDataFeedIterator{
        mavlink: Arc::new(Mutex::new( Some(connect::<MavMessage>(address).unwrap()))),
        // config: Arc::new(Mutex::new(None)),
        is_running: Arc::new(AtomicBool::new(true)),
    };


    

    let mut iterator = iterator.clone();
    let database_service = database_service.clone();
    let res = tokio::spawn(async move {
        info!("SerialDataFeedService has started.");
        while let Some(message) = iterator.next().await {
            println!("Got msg... {:?}", message);
            // SHOULD DO: figure out how to handle database save errors better
            let _ = database_service.lock().await.save(message).await;
        }
        info!("SerialDataFeedService has stopped.");
    }).await;
    res.unwrap();

}
