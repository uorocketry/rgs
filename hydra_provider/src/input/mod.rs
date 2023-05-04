mod random_input;
mod serial_input;

pub use random_input::RandomInput;
pub use serial_input::SerialInput;

use anyhow::Result;
use crate::message_types::MessageTypes;

pub trait HydraInput {
    fn read_message(&mut self) -> Result<MessageTypes>;
}
