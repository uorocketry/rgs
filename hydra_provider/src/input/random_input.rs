use crate::processing::InputData;
use messages::mavlink::MavHeader;
use messages::sender::Sender;
use messages::Message;
use messages::sensor::Air;
use messages::sensor::EkfNav1;
use messages::sensor::EkfNav2;
use messages::sensor::EkfQuat;
use messages::sensor::GpsVel;
use messages::sensor::Imu1;
use messages::sensor::Imu2;
use messages::sensor::Sensor;
use messages::sensor::UtcTime;
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

    fn random_sensor(&mut self) -> Message {
        let time = fugit::Instant::<u64, 1, 1000>::from_ticks(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
        );

        // Convert timestamp to UTC time

        let utc_time = UtcTime {
            time_stamp: time.ticks() as u32,
            day: (time.ticks()/86400000) as i8,
            year: (1970 + (time.ticks()/86400000) / 365) as u16,
            hour: ((time.ticks() % 86400000) / 3600000) as i8,
            minute: ((time.ticks() % 3600000) / 60000) as i8,
            month: ((time.ticks() % 31536000000) / 2592000000) as i8,
            second: ((time.ticks() % 60000) / 1000) as i8,
            nano_second: (time.ticks() % 1000) as i32 * 1000000,
            gps_time_of_week: 0,
            status: 0,
        };

        let air = Air {
            air_temperature: self.rng.gen(),
            altitude: self.rng.gen(),
            pressure_abs: self.rng.gen(),
            pressure_diff: self.rng.gen(),
            status: self.rng.gen(),
            time_stamp: time.ticks() as u32,
            true_airspeed: self.rng.gen(),
        };



        let ekf_quat = EkfQuat {
            euler_std_dev: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            quaternion: [
                self.rng.gen(),
                self.rng.gen(),
                self.rng.gen(),
                self.rng.gen(),
            ],
            status: self.rng.gen(),
            time_stamp: time.ticks() as u32,
        };

        let ekf_nav1  = EkfNav1 {
            time_stamp:  time.ticks() as u32,
            velocity: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            velocity_std_dev: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
        };

        let ekf_nav2 = EkfNav2 {
            position: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            position_std_dev: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            status: self.rng.gen(),
            undulation: self.rng.gen(),
        };

        let imu1 = Imu1 {
            accelerometers: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            gyroscopes: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            status: self.rng.gen(),
            time_stamp: time.ticks() as u32,
        };

        let imu2 = Imu2 {
            delta_angle: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            delta_velocity: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            temperature: self.rng.gen(),
        };

        let gps_vel = GpsVel {
            course: self.rng.gen(),
            course_acc: self.rng.gen(),
            status: self.rng.gen(),
            time_of_week: self.rng.gen(),
            time_stamp: time.ticks() as u32,
            velocity: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            velocity_acc: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
        };

        // Array of sensor messages (we will select one of it)
        let sensors = [
            Sensor::new(utc_time),
            Sensor::new(air),
            Sensor::new(ekf_quat),
            Sensor::new(ekf_nav1),
            Sensor::new(ekf_nav2),
            Sensor::new(imu1),
            Sensor::new(imu2),
            Sensor::new(gps_vel),
        ];

        // Return a random sensor message
        let sensor = sensors[self.rng.gen_range(0..sensors.len())].to_owned();

        Message::new(&time, Sender::GroundStation, sensor)
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
            0 => InputData::RocketData(self.random_sensor()),
            _ => InputData::MavlinkHeader(self.random_mavheader()),
        }

    }
}
