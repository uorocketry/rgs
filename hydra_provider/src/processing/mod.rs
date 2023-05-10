use derive_more::From;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

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

#[derive(Serialize, Deserialize, Clone, Debug, From, TS)]
#[ts(export)]
pub enum ProcessedMessage {
    RocketMessage(messages::Message),
    LinkStatus(LinkStatus),
}
