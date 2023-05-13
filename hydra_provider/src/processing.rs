use derive_more::From;
use serde::Deserialize;
use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug, From, TS)]
#[ts(export)]
pub enum ProcessedMessage {
    RocketData(messages::Message),
}

pub struct Processing {}

impl Processing {
    pub fn new() -> Self {
        Processing {}
    }

    pub fn process(&self, msg: messages::Message) -> ProcessedMessage {
        msg.into()
    }
}
