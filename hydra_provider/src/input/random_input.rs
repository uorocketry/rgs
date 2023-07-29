use crate::processing::InputData;
use messages::Data;

use messages::State;
use messages::Status;
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
use messages::sensor::SensorData;
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

    fn random_sbg(&mut self) -> Message {

        let air = Air{
            time_stamp: self.rng.gen(),
            status: self.rng.gen(),
            pressure_abs: self.rng.gen(),
            pressure_diff: self.rng.gen(),
            altitude: self.rng.gen(),
            air_temperature: self.rng.gen(),
            true_airspeed: self.rng.gen(),
        };
        let ekf_nav1 = EkfNav1{
            time_stamp: self.rng.gen(),
            velocity: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            velocity_std_dev: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
        };
        let ekf_nav2 = EkfNav2{
            position: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            undulation: self.rng.gen(),
            position_std_dev: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            status: self.rng.gen(),
        };
        let ekf_quat = EkfQuat{
            time_stamp: self.rng.gen(),
            quaternion: [self.rng.gen(), self.rng.gen(), self.rng.gen(), self.rng.gen()],
            euler_std_dev: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            status: self.rng.gen(),
        };
        let imu1 = Imu1{
            time_stamp: self.rng.gen(),
            status: self.rng.gen(),
            accelerometers: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            gyroscopes: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
        };
        let imu2 = Imu2{
            temperature: self.rng.gen(),
            delta_velocity: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            delta_angle: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
        };
        let gps_vel = GpsVel{
            time_stamp: self.rng.gen(),
            status: self.rng.gen(),
            time_of_week: self.rng.gen(),
            velocity: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            velocity_acc: [self.rng.gen(), self.rng.gen(), self.rng.gen()],
            course: self.rng.gen(),
            course_acc: self.rng.gen(),
        };          
        let utc_time = UtcTime{
            time_stamp: self.rng.gen(),
            status: self.rng.gen(),
            year: 2023,
            month: 12,
            day: 10,
            hour: self.rng.gen(),
            minute: self.rng.gen(),
            second: self.rng.gen(),
            nano_second: self.rng.gen(),
            gps_time_of_week: self.rng.gen(),
        };

        let time = fugit::Instant::<u64, 1, 1000>::from_ticks(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
        );

        let sensor_data = match self.rng.gen_range(0..=7) {
            0 => SensorData::Air(air),
            1 => SensorData::EkfNav1(ekf_nav1),
            2 => SensorData::EkfNav2(ekf_nav2),
            3 => SensorData::EkfQuat(ekf_quat),
            4 => SensorData::Imu1(imu1),
            5 => SensorData::Imu2(imu2),
            6 => SensorData::GpsVel(gps_vel),
            _ => SensorData::UtcTime(utc_time),
        };

        let sensor = Sensor {
            component_id: 0,
            data: sensor_data,
        };

        let status = match self.rng.gen_range(0..=5) {
            0 => Status::Initializing,
            1 => Status::WaitForTakeoff,
            2 => Status::Ascent,
            3 => Status::Apogee,
            4 => Status::Landed,
            _ => Status::Abort,
        };

        let state = State {
            status: status,
            has_error: self.rng.gen(),
        }; 


        let data = match self.rng.gen_range(0..=1) {
            0 => Data::State(state),
            _ => Data::Sensor(sensor),
        };

        Message::new(&time, Sender::SensorBoard, data)
        
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
