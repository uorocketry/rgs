use derive_more::From;
use messages::mavlink::uorocketry::{HEARTBEAT_DATA, RADIO_STATUS_DATA};
use messages::Message;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, From)]
pub enum HydraInput {
    Message(Message),
    RadioStatus(RADIO_STATUS_DATA),
    Heartbeat(HEARTBEAT_DATA),
}
