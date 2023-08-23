mod rocket_message;

use crate::processing::rocket_message::RocketMessage;
use derive_more::From;
use serde::Deserialize;
use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug, From, TS)]
#[ts(export)]
pub enum ProcessedMessage {
    RocketMessage(RocketMessage),
}

pub struct Processing {}

impl Processing {
    pub fn new() -> Self {
        Processing {}
    }

    pub fn process(&self, msg: messages::Message) -> ProcessedMessage {
        let rocket_message: RocketMessage = msg.into();

        rocket_message.into()
    }
}
