pub mod commands;
pub mod service;

pub use crate::command_service::proto::command_dispatcher_server::CommandDispatcherServer;
pub use service::CommandService; // used by bootstrap to setup a RandomDataFeedService

pub mod proto {
    tonic::include_proto!("command_service");
}
