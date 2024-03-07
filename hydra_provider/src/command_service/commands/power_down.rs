use super::sendable::Sendable;
use messages::command::PowerDown;

impl Sendable for PowerDown {
	fn send() {
		println!("PowerDown was called.")
	}
}