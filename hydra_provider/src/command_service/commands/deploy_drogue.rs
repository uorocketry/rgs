use super::sendable::Sendable;
use messages::command::DeployDrogue;

impl Sendable for DeployDrogue {
    fn send() {
        println!("DeployDrogue was called.")
    }
}
