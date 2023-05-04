use crate::input::HydraInput;
use crate::message_types::MessageTypes;
use messages::sender::Sender;
use messages::sensor::{Sbg, Sensor};
use messages::Message;
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

impl HydraInput for RandomInput {
    fn read_message(&mut self) -> anyhow::Result<MessageTypes> {
        std::thread::sleep(Duration::from_secs(1));

        let sbg = Sbg {
            accel_x: self.rng.gen(),
            accel_y: self.rng.gen(),
            accel_z: self.rng.gen(),
            velocity_n: self.rng.gen(),
            velocity_e: self.rng.gen(),
            pressure: self.rng.gen(),
            height: self.rng.gen(),
            roll: self.rng.gen(),
            yaw: self.rng.gen(),
            pitch: self.rng.gen(),
            latitude: self.rng.gen(),
            longitude: self.rng.gen(),
            quant_w: self.rng.gen(),
            quant_x: self.rng.gen(),
            quant_y: self.rng.gen(),
            velocity_d: self.rng.gen(),
            quant_z: self.rng.gen(),
        };

        let time = fugit::Instant::<u64, 1, 1000>::from_ticks(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)?
                .as_millis() as u64,
        );
        // fugit::Instant::<u64, 1, 1000>::from_ticks(self.time.elapsed().as_millis() as u64);

        Ok(MessageTypes::Message(Message::new(&time, Sender::MainBoard, Sensor::new(0, sbg))))
    }
}
