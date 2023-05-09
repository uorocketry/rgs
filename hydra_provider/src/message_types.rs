use derive_more::From;
use mavlink::uorocketry::RADIO_STATUS_DATA;
use mavlink;
use messages::Message;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
pub enum MessageTypes {
    RadioStatus(RadioStatus),
    Message(Message),
}

#[derive(Serialize, Deserialize, Clone, Debug, From, TS)]
pub struct RadioStatus {
    pub rssi : u8,
    pub remrssi : u8,
    pub txbuf : u8,
    pub noise : u8,
    pub remnoise : u8,
    pub rxerrors : u16,
    pub fixed : u16,

}


impl From<RADIO_STATUS_DATA> for RadioStatus {
    fn from(data: RADIO_STATUS_DATA) -> Self {
        RadioStatus {
            rssi: data.rssi,
            remrssi: data.remrssi,
            txbuf: data.txbuf,
            noise: data.noise,
            remnoise: data.remnoise,
            rxerrors: data.rxerrors,
            fixed: data.fixed,
        }
    }
}