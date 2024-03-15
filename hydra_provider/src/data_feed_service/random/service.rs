use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tonic::{async_trait, Request, Response, Status};
use log::info;

use crate::database_service::DatabaseService;
use crate::hydra_input::HydraInput;
use crate::data_feed_service::random::iterator::RandomDataFeedIterator;

use crate::data_feed_service::proto::random_data_feed_server::*;
use crate::data_feed_service::proto::Empty;

pub struct RandomDataFeedService<'a> {
	iterator: RandomDataFeedIterator,
	database_service: &'a DatabaseService,
}

impl<'a> RandomDataFeedService<'_> {
	pub fn new(
		database_service: &'a DatabaseService,
	) -> RandomDataFeedService {
		RandomDataFeedService {
			iterator: RandomDataFeedIterator {
				is_running: Arc::new(AtomicBool::new(false)),
			},
			database_service,
		}
	}
}

#[async_trait]
impl RandomDataFeed for RandomDataFeedService<'static> {
	async fn start(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
		self.iterator.is_running.store(true, Ordering::Relaxed);

		let iterator = self.iterator;
		tokio::spawn(async move {
			info!("RandomDataFeedService has started.");
			while let Some(message) = iterator.next() {
				self.database_service.save(HydraInput::Message(message));
			}
		});

		Ok(Response::new(Empty {}))
	}

	async fn stop(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
		self.iterator.is_running.store(false, Ordering::Relaxed);
		Ok(Response::new(Empty {}))
	}
}
