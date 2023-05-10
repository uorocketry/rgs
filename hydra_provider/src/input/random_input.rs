use crate::processing::InputData;
use messages::mavlink::MavHeader;
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

impl RandomInput {
    pub fn read_loop(&mut self, send: std::sync::mpsc::Sender<InputData>) -> ! {
        loop {
            std::thread::sleep(Duration::from_secs(1));

            let msg = self.read_message();
            send.send(msg).unwrap();
        }
    }

    fn random_sbg(&mut self) -> Message {
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
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
        );

        Message::new(&time, Sender::MainBoard, Sensor::new(0, sbg))
    }

    fn random_mavheader(&mut self) -> MavHeader {
        MavHeader {
            system_id: 0,
            component_id: 0,
            sequence: self.rng.gen(),
        }
    }

    fn read_message(&mut self) -> InputData {
        match self.rng.gen_range(0..=1) {
            0 => InputData::RocketData(self.random_sbg()),
            _ => InputData::MavlinkHeader(self.random_mavheader()),
        }
    }
}
