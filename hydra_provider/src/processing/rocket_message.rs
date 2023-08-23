use messages::sender::Sender;
use messages::sensor::Sensor;
use messages::{Data, Log, LogLevel, Message, State};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct RocketMessage {
    pub timestamp: u64,
    pub sender: Sender,
    pub data: RocketData,
}

impl From<Message> for RocketMessage {
    fn from(value: Message) -> Self {
        RocketMessage {
            timestamp: value.timestamp,
            sender: value.sender,
            data: match value.data {
                Data::State(x) => RocketData::State(x),
                Data::Sensor(x) => RocketData::Sensor(x),
                Data::Log(x) => RocketData::Log(x.into()),
            },
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub enum RocketData {
    State(State),
    Sensor(Sensor),
    Log(RocketLog),
}

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct RocketLog {
    level: LogLevel,
    msg: String,
}

impl From<Log> for RocketLog {
    fn from(value: Log) -> Self {
        RocketLog {
            level: value.level,
            msg: value.event.to_string(),
        }
    }
}
