use crate::hydra_iterator::HydraInput;
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
use rand::rngs::StdRng;
use rand::Rng;
use rand::SeedableRng;
use std::time::Duration;
use std::time::SystemTime;

pub fn process_random_input() -> Box<dyn Iterator<Item = HydraInput> + Send> {
    struct IteratorObj {
        rng: StdRng,
    }

    fn random_sensor(rng: &mut StdRng) -> Message {
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
            air_temperature: rng.gen(),
            altitude: rng.gen(),
            pressure_abs: rng.gen(),
            pressure_diff: rng.gen(),
            status: rng.gen(),
            time_stamp: time.ticks() as u32,
            true_airspeed: rng.gen(),
        };

        let ekf_quat = EkfQuat {
            euler_std_dev: [rng.gen(), rng.gen(), rng.gen()],
            quaternion: [rng.gen(), rng.gen(), rng.gen(), rng.gen()],
            status: rng.gen(),
            time_stamp: time.ticks() as u32,
        };

        let ekf_nav1 = EkfNav1 {
            time_stamp: time.ticks() as u32,
            velocity: [rng.gen(), rng.gen(), rng.gen()],
            velocity_std_dev: [rng.gen(), rng.gen(), rng.gen()],
        };

        let ekf_nav2 = EkfNav2 {
            position: [rng.gen(), rng.gen(), rng.gen()],
            position_std_dev: [rng.gen(), rng.gen(), rng.gen()],
            status: rng.gen(),
            undulation: rng.gen(),
        };

        let imu1 = Imu1 {
            accelerometers: [rng.gen(), rng.gen(), rng.gen()],
            gyroscopes: [rng.gen(), rng.gen(), rng.gen()],
            status: rng.gen(),
            time_stamp: time.ticks() as u32,
        };

        let imu2 = Imu2 {
            delta_angle: [rng.gen(), rng.gen(), rng.gen()],
            delta_velocity: [rng.gen(), rng.gen(), rng.gen()],
            temperature: rng.gen(),
        };

        let gps_vel = GpsVel {
            course: rng.gen(),
            course_acc: rng.gen(),
            status: rng.gen(),
            time_of_week: rng.gen(),
            time_stamp: time.ticks() as u32,
            velocity: [rng.gen(), rng.gen(), rng.gen()],
            velocity_acc: [rng.gen(), rng.gen(), rng.gen()],
        };

        let gps_pos1 = GpsPos1 {
            time_stamp: time.ticks() as u32,
            status: rng.gen(),
            time_of_week: rng.gen(),
            latitude: rng.gen(),
            longitude: rng.gen(),
            altitude: rng.gen(),
            undulation: rng.gen(),
        };

        let gps_pos2 = GpsPos2 {
            latitude_accuracy: rng.gen(),
            longitude_accuracy: rng.gen(),
            altitude_accuracy: rng.gen(),
            num_sv_used: rng.gen(),
            base_station_id: rng.gen(),
            differential_age: rng.gen(),
        };

        let current = Current {
            current: rng.gen(),
            rolling_avg: rng.gen(),
        };

        let voltage = Voltage {
            rolling_avg: rng.gen(),
            voltage: rng.gen(),
        };

        let regulator = Regulator {
            // true or false
            status: rng.gen::<f32>() > 0.5f32,
        };

        let temperature = Temperature {
            rolling_avg: rng.gen(),
            temperature: rng.gen(),
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

        let status = match rng.gen_range(0..=6) {
            0 => StateData::Initializing,
            1 => StateData::WaitForTakeoff,
            2 => StateData::Ascent,
            3 => StateData::Descent,
            4 => StateData::TerminalDescent,
            5 => StateData::WaitForRecovery,
            _ => StateData::Abort,
        };

        // Return a random sensor message
        let sensor = sensors[rng.gen_range(0..sensors.len())].to_owned();

        let state = State { data: status };

        let log = Log::new(messages::LogLevel::Info, messages::Event::Initialized());

        let command = Command {
            data: messages::command::CommandData::DeployDrogue({
                messages::command::DeployDrogue { val: true }
            }),
        };

        let data = match rng.gen_range(0..=3) {
            0 => Data::State(state),
            1 => Data::Log(log),
            2 => Data::Command(command),
            3 => Data::Sensor(sensor),
            _ => Data::Sensor(sensor),
        };

        Message::new(&time, Sender::GroundStation, data)
    }

    impl Iterator for IteratorObj {
        type Item = HydraInput;

        fn next(&mut self) -> Option<Self::Item> {
            std::thread::sleep(Duration::from_millis(45));

            let msg = match self.rng.gen_range(0..=1) {
                0 => HydraInput::RocketData(random_sensor(&mut self.rng)),
                _ => HydraInput::MavlinkHeader(MavHeader {
                    system_id: 0,
                    component_id: 0,
                    sequence: self.rng.gen(),
                }),
            };
            Some(msg)
        }
    }

    return Box::from(IteratorObj {
        rng: StdRng::from_entropy(),
    });
}
