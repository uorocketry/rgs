use crate::input::HydraInput;
use messages::sender::Sender;
use messages::sensor::{Sbg, Sensor};
use messages::Message;
use rand::rngs::ThreadRng;
use rand::Rng;
use std::time::SystemTime;
use std::time::UNIX_EPOCH;
use std::time::{Duration, Instant};

pub struct RandomInput {
    rng: ThreadRng,
    time: Instant,
}

impl RandomInput {
    pub fn new() -> Self {
        let rng = rand::thread_rng();
        RandomInput {
            rng,
            time: Instant::now(),
        }
    }
}

impl HydraInput for RandomInput {
    fn read_message(&mut self) -> anyhow::Result<Message> {
        std::thread::sleep(Duration::from_millis(1));

        let sbg = Sbg {
            accel: self.rng.gen(),
            speed: self.rng.gen(),
            pressure: self.rng.gen(),
            height: self.rng.gen(),
        };

        // Get unix timestamp
        // fugit::Instant::<u64, 1, 1000>::from_ticks(self.time.elapsed().as_millis() as u64);

        let time = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_millis() as u64;

        let time = fugit::Instant::<u64, 1, 1000>::from_ticks(time);

        Ok(Message::new(&time, Sender::MainBoard, Sensor::new(0, sbg)))
    }
}
