use derive_more::From;
use messages::mavlink;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, From)]
pub enum HydraInput {
    RocketData(messages::Message),
    MavlinkRadioStatus(mavlink::uorocketry::RADIO_STATUS_DATA),
    MavlinkHeader(mavlink::MavHeader),
    MavlinkHeartbeat(),
}
