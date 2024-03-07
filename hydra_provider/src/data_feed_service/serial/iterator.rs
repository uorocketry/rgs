use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use messages::mavlink::MavConnection;
use postcard::from_bytes;
use log::info;

use crate::data_feed_service::message::HydraInput;
use messages::Message;
use crate::data_feed_service::proto::SerialDataFeedConfig;

use messages::mavlink::uorocketry::MavMessage;

pub struct SerialDataFeedIterator {
	pub config: Arc<Mutex<Option<SerialDataFeedConfig>>>,
	pub mavlink: Arc<Mutex<Option<Box<dyn MavConnection<MavMessage> + Send + Sync>>>>,
	pub is_running: Arc<AtomicBool>,
}

impl Iterator for SerialDataFeedIterator {
	type Item = HydraInput;

	fn next(&mut self) -> Option<HydraInput> {
		if !self.is_running.load(Ordering::Relaxed) {
			return None;
		}
		let mut mavlink_option = self.mavlink.lock().unwrap();
		if mavlink_option.is_none() {
			return None;
		}

		let mavlink = mavlink_option.unwrap();
		let (_, mavlink_message) = mavlink.recv().unwrap();
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
