use log::info;
use postcard::from_bytes;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::data_feed_service::proto::SerialDataFeedConfig;
use crate::hydra_input::HydraInput;
use crate::mavlink_service::MavlinkService;
use messages::Message;

use messages::mavlink::uorocketry::MavMessage;

#[derive(Clone)]
pub struct SerialDataFeedIterator {
    pub config: Arc<Mutex<Option<SerialDataFeedConfig>>>,
    pub mavlink_service: Arc<Mutex<MavlinkService>>,
    pub is_running: Arc<AtomicBool>,
}

impl SerialDataFeedIterator {
    pub async fn next(&mut self) -> Option<HydraInput> {
        if !self.is_running.load(Ordering::Relaxed) {
            return None;
        }

        let mavlink_message = self.mavlink_service.lock().await.read_next();
        let message = match &mavlink_message {
            MavMessage::POSTCARD_MESSAGE(data) => {
                let data: Message = from_bytes(data.message.as_slice()).unwrap();
                info!("Received rocket message: {:#?}", data);
                HydraInput::Message(data)
            }
            MavMessage::RADIO_STATUS(data) => {
                info!("Received radio status: {:?}", data);
                HydraInput::RadioStatus(data.clone())
            }
            MavMessage::HEARTBEAT(heartbeat) => {
                info!("Received heartbeat.");
                HydraInput::Heartbeat(heartbeat.clone())
            }
        };

        Some(message)
    }
}
