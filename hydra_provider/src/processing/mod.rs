use derive_more::From;
use messages::mavlink;
use serde::{Deserialize, Serialize};

mod link_status;
mod rocket_processing;

pub use link_status::{LinkData, LinkStatus, LinkStatusProcessing};
pub use rocket_processing::RocketProcessing;

#[derive(Clone, Debug)]
pub enum InputData {
    RocketData(messages::Message),
    MavlinkRadioStatus(mavlink::uorocketry::RADIO_STATUS_DATA),
    MavlinkHeader(mavlink::MavHeader),
    MavlinkHeartbeat(),
}

#[derive(Serialize, Deserialize, Clone, Debug, From)]
pub enum ProcessedMessage {
    RocketMessage(messages::Message),
    LinkStatus(LinkStatus),
}
