pub mod iterator;
pub mod service;

pub use crate::data_feed_service::proto::random_data_feed_server::RandomDataFeedServer;
pub use service::RandomDataFeedService; // used by bootstrap to setup a RandomDataFeedService
