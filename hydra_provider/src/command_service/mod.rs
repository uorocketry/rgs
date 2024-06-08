pub mod proto;
pub mod service;

pub use crate::command_service::proto::command_dispatcher_server::CommandDispatcherServer;
pub use service::CommandService; // used by bootstrap to setup a RandomDataFeedService
