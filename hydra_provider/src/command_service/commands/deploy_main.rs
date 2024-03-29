use super::sendable::Sendable;
use messages::command::DeployMain;

impl Sendable for DeployMain {
    fn send() {
        println!("DeployMain was called.")
    }
}
