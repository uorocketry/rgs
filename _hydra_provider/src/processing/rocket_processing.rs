use crate::processing::ProcessedMessage;

pub struct RocketProcessing {}

impl RocketProcessing {
    pub fn new() -> Self {
        RocketProcessing {}
    }

    pub fn process(&self, msg: messages::Message) -> ProcessedMessage {
        msg.into()
    }
}
