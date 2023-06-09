use crate::processing::InputData;
use messages::mavlink::MavHeader;
use messages::sender::Sender;
use messages::Message;
use proptest::arbitrary::Arbitrary;
use proptest::strategy::{Strategy, ValueTree};
use proptest::test_runner::TestRunner;
use rand::rngs::ThreadRng;
use rand::Rng;
use std::time::Duration;
use std::time::SystemTime;

pub struct RandomInput {
    rng: ThreadRng,
}

impl RandomInput {
    pub fn new() -> Self {
        let rng = rand::thread_rng();
        RandomInput { rng }
    }
}

impl RandomInput {
    pub fn read_loop(&mut self, send: std::sync::mpsc::Sender<InputData>) -> ! {
        loop {
            std::thread::sleep(Duration::from_secs(1));

            let msg = self.read_message();
            send.send(msg).unwrap();
        }
    }

    fn random_mavheader(&mut self) -> MavHeader {
        MavHeader {
            system_id: 0,
            component_id: 0,
            sequence: self.rng.gen(),
        }
    }

    fn random_message() -> Message {
        // This takes advantage of the proptest library that we are already using to test the
        // message.
        let mut runner = TestRunner::default();

        Message::arbitrary()
            .new_tree(&mut runner)
            .unwrap()
            .current()
    }

    fn read_message(&mut self) -> InputData {
        match self.rng.gen_range(0..=1) {
            0 => InputData::RocketData(RandomInput::random_message()),
            _ => InputData::MavlinkHeader(self.random_mavheader()),
        }
    }
}
