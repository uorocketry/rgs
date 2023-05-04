use mavlink::uorocketry::RADIO_STATUS_DATA;
use mavlink;
use messages::Message;
pub enum MessageTypes {
    RadioStatus(RadioStatus),
    Message(Message),
}

#[derive(Clone, Debug)]
pub struct RadioStatus {
    pub radio : RADIO_STATUS_DATA,
}


impl RadioStatus {
    pub fn new(radio: impl Into<RADIO_STATUS_DATA>) -> Self {
        RadioStatus {
            radio: radio.into(),
        }
    }
}