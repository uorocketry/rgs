use messages::mavlink::connect;
use messages::mavlink::error::MessageReadError;
use messages::mavlink::error::MessageWriteError;
use messages::mavlink::uorocketry::MavMessage;
use messages::mavlink::MavConnection;
use messages::mavlink::MavHeader;

/**
 * Handles all interactions with the Mavlink module
 */
pub struct MavlinkService {
    pub mavlink: Option<Box<dyn MavConnection<MavMessage> + Send + Sync>>,
    message_count: u8,
}

impl MavlinkService {
    pub fn new() -> MavlinkService {
        MavlinkService {
            mavlink: None,
            message_count: 0,
        }
    }

    pub fn reconnect(&mut self, port: i32, baud_rate: i32) {
        let address = format!("serial:{}:{}", port, baud_rate);
        self.mavlink = Some(connect::<MavMessage>(address.as_str()).unwrap());
    }

    pub fn read_next(&self) -> Result<MavMessage, MessageReadError> {
        let (_, message) = self.mavlink.as_ref().unwrap().recv()?;
        Ok(message)
    }

    pub fn write(&self, message: &MavMessage) -> Result<usize, MessageWriteError> {
        self.message_count = self.message_count.wrapping_add(1);
        let header = MavHeader {
            system_id: 2,
            component_id: 2, // identifier of rgs
            sequence: self.message_count,
        };
        return self.mavlink.unwrap().send(&header, message);
    }
}
