use derive_more::From;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

mod radio_status;
mod rocket_processing;

pub use radio_status::{RadioData, RadioStatus};
pub use rocket_processing::RocketProcessing;

#[derive(Clone, Debug)]
pub enum InputData {
    RocketData(messages::Message),
    RadioStatus(mavlink::uorocketry::RADIO_STATUS_DATA),
    MavlinkHeader(mavlink::MavHeader),
}

#[derive(Serialize, Deserialize, Clone, Debug, From, TS)]
#[ts(export)]
pub enum ProcessedMessage {
    RocketMessage(messages::Message),
    LinkStatus(radio_status::LinkStatus),
}
