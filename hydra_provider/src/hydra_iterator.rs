use derive_more::From;
use messages::mavlink::uorocketry::{HEARTBEAT_DATA, RADIO_STATUS_DATA};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, From)]
pub enum HydraInput {
    RocketData(messages::Message),
    MavlinkRadioStatus(RADIO_STATUS_DATA),
    MavlinkHeartbeat(HEARTBEAT_DATA),
}
