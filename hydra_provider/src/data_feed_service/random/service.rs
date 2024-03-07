use log::info;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tonic::{async_trait, Request, Response, Status};

use crate::data_feed_service::message::HydraInput;
use crate::data_feed_service::random::iterator::RandomDataFeedIterator;
use crate::database_service::service::DatabaseService;

use crate::data_feed_service::proto::random_data_feed_server::*;
use crate::data_feed_service::proto::Empty;

pub struct RandomDataFeedService {
    iterator: RandomDataFeedIterator,
    database_service: Arc<DatabaseService>,
}

impl RandomDataFeedService {
    pub fn new(database_service: Arc<DatabaseService>) -> RandomDataFeedService {
        RandomDataFeedService {
            iterator: RandomDataFeedIterator {
                is_running: Arc::new(AtomicBool::new(false)),
            },
            database_service,
        }
    }
}

#[async_trait]
impl RandomDataFeed for RandomDataFeedService {
    async fn start(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
        self.iterator.is_running.store(true, Ordering::Relaxed);

        let mut iterator = self.iterator.clone();
        let database_service = self.database_service.clone();

        tokio::spawn(async move {
            info!("RandomDataFeedService has started.");
            while let Some(message) = iterator.next() {
                database_service.save(HydraInput::Message(message));
            }
        });

        Ok(Response::new(Empty {}))
    }

    async fn stop(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
        self.iterator.is_running.store(false, Ordering::Relaxed);
        Ok(Response::new(Empty {}))
    }
}
