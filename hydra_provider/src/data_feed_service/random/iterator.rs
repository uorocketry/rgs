use rand::Rng;
use rand::{rngs::StdRng, SeedableRng};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::SystemTime;

use messages::{
    command::Command,
    health::Health,
    sensor::{
        Air, EkfNav1, EkfNav2, EkfQuat, GpsPos1, GpsPos2, GpsVel, Imu1, Imu2, Sensor, UtcTime,
    },
    state::{State, StateData},
    Data, Log, Message,
};

use crate::hydra_input::HydraInput;

#[derive(Clone)]
pub struct RandomDataFeedIterator {
    pub is_running: Arc<AtomicBool>,
}

impl RandomDataFeedIterator {
    pub async fn next(&mut self) -> Option<HydraInput> {
        if !self.is_running.load(Ordering::Relaxed) {
            return None;
        }

        // SHOULD DO: move this outside. No need to initialize every iterator step
        let mut std_rng = StdRng::from_entropy();

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
            air_temperature: std_rng.gen(),
            altitude: std_rng.gen(),
            pressure_abs: std_rng.gen(),
            pressure_diff: std_rng.gen(),
            status: std_rng.gen(),
            time_stamp: time.ticks() as u32,
            true_airspeed: std_rng.gen(),
        };

        let ekf_quat = EkfQuat {
            euler_std_dev: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            quaternion: [std_rng.gen(), std_rng.gen(), std_rng.gen(), std_rng.gen()],
            status: std_rng.gen(),
            time_stamp: time.ticks() as u32,
        };

        let ekf_nav1 = EkfNav1 {
            time_stamp: time.ticks() as u32,
            velocity: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            velocity_std_dev: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
        };

        let ekf_nav2 = EkfNav2 {
            position: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            position_std_dev: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            status: std_rng.gen(),
            undulation: std_rng.gen(),
        };

        let imu1 = Imu1 {
            accelerometers: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            gyroscopes: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            status: std_rng.gen(),
            time_stamp: time.ticks() as u32,
        };

        let imu2 = Imu2 {
            delta_angle: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            delta_velocity: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            temperature: std_rng.gen(),
        };

        let gps_vel = GpsVel {
            course: std_rng.gen(),
            course_acc: std_rng.gen(),
            status: std_rng.gen(),
            time_of_week: std_rng.gen(),
            time_stamp: time.ticks() as u32,
            velocity: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
            velocity_acc: [std_rng.gen(), std_rng.gen(), std_rng.gen()],
        };

        let gps_pos1 = GpsPos1 {
            time_stamp: time.ticks() as u32,
            status: std_rng.gen(),
            time_of_week: std_rng.gen(),
            latitude: std_rng.gen(),
            longitude: std_rng.gen(),
            altitude: std_rng.gen(),
            undulation: std_rng.gen(),
        };

        let gps_pos2 = GpsPos2 {
            latitude_accuracy: std_rng.gen(),
            longitude_accuracy: std_rng.gen(),
            altitude_accuracy: std_rng.gen(),
            num_sv_used: std_rng.gen(),
            base_station_id: std_rng.gen(),
            differential_age: std_rng.gen(),
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
        ];

        let status = match std_rng.gen_range(0..=6) {
            0 => StateData::Initializing,
            1 => StateData::WaitForTakeoff,
            2 => StateData::Ascent,
            3 => StateData::Descent,
            4 => StateData::TerminalDescent,
            5 => StateData::WaitForRecovery,
            _ => StateData::Abort,
        };

        // Return a random sensor message
        let mut sensor = sensors[std_rng.gen_range(0..sensors.len())].to_owned();
        sensor.component_id = std_rng.gen();

        let state = State { data: status };

        let log = Log::new(messages::LogLevel::Info, messages::Event::Initialized());

        let command = Command {
            data: messages::command::CommandData::DeployDrogue({
                messages::command::DeployDrogue { val: true }
            }),
        };

        let data = match std_rng.gen_range(0..=4) {
            0 => Data::State(state),
            1 => Data::Log(log),
            2 => Data::Command(command),
            3 => Data::Sensor(sensor),
            4 => Data::Health(Health {
                data: messages::health::HealthData::HealthStatus(messages::health::HealthStatus {
                    v5: Some(1),
                    v3_3: std_rng.gen(),
                    pyro_sense: std_rng.gen(),
                    vcc_sense: std_rng.gen(),
                    int_v5: std_rng.gen(),
                    int_v3_3: std_rng.gen(),
                    ext_v5: std_rng.gen(),
                    ext_3v3: std_rng.gen(),
                    failover_sense: std_rng.gen(),
                }),
                status: messages::health::HealthState::Nominal,
            }),
            _ => Data::Sensor(sensor),
        };

        Some(HydraInput::Message(Message::new(
            &time,
            messages::sender::Sender::GroundStation,
            data,
        )))
    }
}
