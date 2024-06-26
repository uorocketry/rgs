use log::info;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::{async_trait, Request, Response, Status};

use crate::data_feed_service::random::iterator::RandomDataFeedIterator;
use crate::database_service::DatabaseService;

use crate::data_feed_service::proto::Empty;
use crate::data_feed_service::proto::{random_data_feed_server::*, RandomDataFeedStatus};

pub struct RandomDataFeedService {
    iterator: RandomDataFeedIterator,
    database_service: Arc<Mutex<DatabaseService>>,
}

impl RandomDataFeedService {
    pub fn new(database_service: Arc<Mutex<DatabaseService>>) -> RandomDataFeedService {
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
            while let Some(message) = iterator.next().await {
                // SHOULD DO: figure out how to handle database save errors better
                let _ = database_service.lock().await.save(message).await;
            }
            info!("RandomDataFeedService has stopped.");
        });

        Ok(Response::new(Empty {}))
    }

    async fn stop(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
        self.iterator.is_running.store(false, Ordering::Relaxed);
        Ok(Response::new(Empty {}))
    }

    // is_running

    async fn get_status(
        &self,
        _request: Request<Empty>,
    ) -> Result<Response<RandomDataFeedStatus>, Status> {
        let is_running = self.iterator.is_running.load(Ordering::Relaxed);
        Ok(Response::new(RandomDataFeedStatus {
            is_running,
            config: None,
        }))
    }
}
