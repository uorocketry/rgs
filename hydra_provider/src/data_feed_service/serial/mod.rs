pub mod iterator;
pub mod service;
// pub use crate::data_feed_service::proto::serial_data_feed_server::SerialDataFeedServer;
pub use service::SerialDataFeedService; // used by bootstrap to setup a SerialDataFeedService
