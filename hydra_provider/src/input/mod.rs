mod random_input;
mod serial_input;

use crate::processing::InputData;
pub use random_input::RandomInput;
pub use serial_input::SerialInput;
use std::sync::mpsc;

pub trait HydraInput {
    fn read_loop(&mut self, send: mpsc::Sender<InputData>) -> !;
}
