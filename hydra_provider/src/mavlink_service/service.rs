use messages::mavlink::connect;
use messages::mavlink::error::MessageReadError;
use messages::mavlink::error::MessageWriteError;
use messages::mavlink::uorocketry::MavMessage;
use messages::mavlink::MavConnection;
use messages::mavlink::MavHeader;
use std::sync::atomic::{AtomicU8, Ordering};
use std::sync::Arc;
use tokio::io;

/**
 * Handles all interactions with the Mavlink module
 */
pub struct MavlinkService {
    pub mavlink: Option<Box<dyn MavConnection<MavMessage> + Send + Sync>>,
    message_count: Arc<AtomicU8>,
}

impl MavlinkService {
    pub fn new() -> MavlinkService {
        MavlinkService {
            mavlink: None,
            message_count: Arc::new(AtomicU8::new(0)),
        }
    }

    pub fn reconnect(&mut self, port: i32, baud_rate: i32) -> Result<(), io::Error> {
        let address = format!("serial:{}:{}", port, baud_rate);
        match connect::<MavMessage>(address.as_str()) {
            Ok(mavlink) => {
                self.mavlink = Some(mavlink);
                Ok(())
            }
            Err(error) => {
                self.mavlink = None;
                return Err(error);
            }
        }
    }

    pub fn read_next(&self) -> Result<MavMessage, MessageReadError> {
        let (_, message) = self.mavlink.as_ref().unwrap().recv()?;
        Ok(message)
    }

    pub fn write(&mut self, message: &MavMessage) -> Result<usize, MessageWriteError> {
        let sequence = self.message_count.load(Ordering::Acquire).wrapping_add(1);
        self.message_count.store(sequence, Ordering::Release);
        let header = MavHeader {
            system_id: 2,
            component_id: 2, // identifier of rgs
            sequence: sequence,
        };
        return self.mavlink.as_ref().unwrap().send(&header, message);
    }
}
