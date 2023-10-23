use crate::processing::InputData;
use messages::command::Command;
use messages::mavlink::MavHeader;
use messages::sender::Sender;
use messages::sensor::Air;
use messages::sensor::Current;
use messages::sensor::EkfNav1;
use messages::sensor::EkfNav2;
use messages::sensor::EkfQuat;
use messages::sensor::GpsPos1;
use messages::sensor::GpsPos2;
use messages::sensor::GpsVel;
use messages::sensor::Imu1;
use messages::sensor::Imu2;
use messages::sensor::Regulator;
use messages::sensor::Sensor;
use messages::sensor::Temperature;
use messages::sensor::UtcTime;
use messages::sensor::Voltage;
use messages::state::State;
use messages::state::StateData;
use messages::Data;
use messages::Log;
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
            std::thread::sleep(Duration::from_millis(100));

            let msg = self.read_message();
            send.send(msg).unwrap();
        }
    }

    fn random_sensor(&mut self) -> Message {
        let time: fugit::Instant<u64, 1, 1000> = fugit::Instant::<u64, 1, 1000>::from_ticks(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
        );

        // Convert timestamp to UTC time

        let utc_time = UtcTime {
            time_stamp: time.ticks() as u32,
            day: (time.ticks() / 86400000) as i8,
            year: (1970 + (time.ticks() / 86400000) / 365) as u16,
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

        let ekf_nav1 = EkfNav1 {
            time_stamp: time.ticks() as u32,
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

        let gps_pos1 = GpsPos1 {
            time_stamp: time.ticks() as u32,
            status: self.rng.gen(),
            time_of_week: self.rng.gen(),
            latitude: self.rng.gen(),
            longitude: self.rng.gen(),
            altitude: self.rng.gen(),
            undulation: self.rng.gen(),
        };

        let gps_pos2 = GpsPos2 {
            latitude_accuracy: self.rng.gen(),
            longitude_accuracy: self.rng.gen(),
            altitude_accuracy: self.rng.gen(),
            num_sv_used: self.rng.gen(),
            base_station_id: self.rng.gen(),
            differential_age: self.rng.gen(),
        };

        let current = Current {
            current: self.rng.gen(),
            rolling_avg: self.rng.gen(),
        };

        let voltage = Voltage {
            rolling_avg: self.rng.gen(),
            voltage: self.rng.gen(),
        };

        let regulator = Regulator {
            // true or false
            status: self.rng.gen::<f32>() > 0.5f32,
        };

        let temperature = Temperature {
            rolling_avg: self.rng.gen(),
            temperature: self.rng.gen(),
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
            Sensor::new(gps_pos1),
            Sensor::new(gps_pos2),
            Sensor::new(current),
            Sensor::new(voltage),
            Sensor::new(regulator),
            Sensor::new(temperature),
        ];

        let status = match self.rng.gen_range(0..=6) {
            0 => StateData::Initializing,
            1 => StateData::WaitForTakeoff,
            2 => StateData::Ascent,
            3 => StateData::Descent,
            4 => StateData::TerminalDescent,
            5 => StateData::WaitForRecovery,
            _ => StateData::Abort,
        };

        // Return a random sensor message
        let sensor = sensors[self.rng.gen_range(0..sensors.len())].to_owned();

        let state = State { data: status };

        let log = Log::new(messages::LogLevel::Info, messages::Event::Initialized());

        let command = Command {
            data: messages::command::CommandData::DeployDrogue({
                messages::command::DeployDrogue { val: true }
            }),
        };

        let data = match self.rng.gen_range(0..=3) {
            0 => Data::State(state),
            1 => Data::Log(log),
            2 => Data::Command(command),
            3 => Data::Sensor(sensor),
            _ => Data::Sensor(sensor),
        };

        Message::new(&time, Sender::GroundStation, data)
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
