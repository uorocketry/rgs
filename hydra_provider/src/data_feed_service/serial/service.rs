use crate::data_feed_service::serial::iterator::SerialDataFeedIterator;
use crate::database_service::DatabaseService;
use log::info;
use messages::mavlink::connect;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::Mutex;


#[derive(Clone)]
pub struct SerialDataFeedService {
    iterator: SerialDataFeedIterator,
    database_service: Arc<Mutex<DatabaseService>>,
}

impl SerialDataFeedService {
    pub fn new(database_service: Arc<Mutex<DatabaseService>>) -> SerialDataFeedService {
        SerialDataFeedService {
            iterator: SerialDataFeedIterator {
                is_running: Arc::new(AtomicBool::new(false)),
                mavlink: Arc::new(Mutex::new(None)),
                // config: Arc::new(Mutex::new(None)),
            },
            database_service,
        }
    }
}

// #[async_trait]
// impl SerialDataFeedService {
//     async fn start(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
//         self.iterator.is_running.store(true, Ordering::Relaxed);

//         let mut iterator = self.iterator.clone();
//         let database_service = self.database_service.clone();
//         tokio::spawn(async move {
//             info!("SerialDataFeedService has started.");
//             while let Some(message) = iterator.next().await {
//                 // SHOULD DO: figure out how to handle database save errors better
//                 let _ = database_service.lock().await.save(message).await;
//             }
//             info!("SerialDataFeedService has stopped.");
//         });

//         Ok(Response::new(Empty {}))
//     }

    // async fn configure(
    //     &self,
    //     request: Request<SerialDataFeedConfig>,
    // ) -> Result<Response<Empty>, Status> {
    //     // let config = request.into_inner();

    //     // let address = format!("serial:{}:{}", config.port, config.baud_rate);
    //     // connect::<MavMessage>("tcpout:127.0.0.1:5656").unwrap();
    //     let address = "tcpout:127.0.0.1:5656";
    //     let mut mavlink = self.iterator.mavlink.lock().await;
    //     *mavlink = Some(connect::<MavMessage>(address.as_str()).unwrap());

    //     Ok(Response::new(Empty {}))
    // }

    // async fn get_status(
    //     &self,
    //     _request: Request<Empty>,
    // ) -> Result<Response<SerialDataFeedStatus>, Status> {
    //     Ok(Response::new(SerialDataFeedStatus {
    //         is_running: self.iterator.is_running.load(Ordering::Relaxed),
    //         config: self.iterator.config.lock().await.clone(),
    //     }))
    // }
// }
