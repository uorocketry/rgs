use mavlink::uorocketry::MavMessage;
use messages::{
    mavlink,
    sensor::{
        Air, EkfNav1, EkfNav2, EkfNavAcc, EkfQuat, GpsPos1, GpsPos2, GpsPosAcc, GpsVel, GpsVelAcc,
        Imu1, Imu2, RecoverySensing, Sensor, SensorData, UtcTime,
    },
    sensor_status::{
        AirStatus, EkfStatus, GpsPositionStatus, GpsVelStatus, ImuStatus, UtcTimeStatus,
    },
    state::{State, StateData},
    Message,
};
use rand::Rng;

pub fn random_message() -> MavMessage {
    let num = rand::thread_rng().gen_range(0..=7); // TODO: Change to 0 to 7

    return match num {
        0 => MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
            message: random_state_message_buf(),
        }),
        1 => random_message(),
        2 => MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
            message: random_sensor_message_buf(),
        }),
        3 => random_message(),
        4 => random_message(),
        5 => random_message(),
        6 => MavMessage::RADIO_STATUS(random_radio_status_message_buf()),
        7 => random_message(),
        _ => {
            panic!("Not implemented");
        }
    };
}

pub fn random_radio_status_message_buf() -> mavlink::uorocketry::RADIO_STATUS_DATA {
    return mavlink::uorocketry::RADIO_STATUS_DATA {
        rxerrors: 0,
        fixed: 0,
        rssi: 0,
        remrssi: 0,
        txbuf: 0,
        noise: 0,
        remnoise: 0,
    };
}

pub fn random_state_message_buf() -> [u8; 255] {
    let random_state = rand::thread_rng().gen_range(0..7);
    let state_data = match random_state {
        0 => StateData::Initializing,
        1 => StateData::WaitForTakeoff,
        2 => StateData::Ascent,
        3 => StateData::Descent,
        4 => StateData::TerminalDescent,
        5 => StateData::WaitForRecovery,
        6 => StateData::Abort,
        _ => panic!("Invalid state"),
    };
    let data = State::new(state_data);
    let msg = Message::new(
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as u32,
        messages::sender::Sender::CameraBoard,
        data,
    );

    let mut buf = [0u8; 255];

    postcard::to_slice(&msg, &mut buf).unwrap();
    return buf;
}

pub fn random_sensor_message_buf() -> [u8; 255] {
    let time_stamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as u32;

    let random_sensor = rand::thread_rng().gen_range(0..13);
    let sensor_data = match random_sensor {
        0 => SensorData::UtcTime(UtcTime {
            time_stamp: time_stamp,
            status: UtcTimeStatus::new(0),
            year: Some(0),
            month: Some(0),
            day: Some(0),
            hour: Some(0),
            minute: Some(0),
            second: Some(0),
            nano_second: Some(0),
            gps_time_of_week: Some(0),
        }),
        1 => SensorData::Air(Air {
            time_stamp: time_stamp,
            pressure_abs: Some(0.0),
            altitude: Some(0.0),
            pressure_diff: Some(0.0),
            true_airspeed: Some(0.0),
            air_temperature: Some(0.0),
            status: AirStatus::new(0),
        }),
        2 => SensorData::EkfQuat(EkfQuat {
            time_stamp: time_stamp,
            status: EkfStatus::new(0),
            quaternion: Some([0.0, 0.0, 0.0, 0.0]),
            euler_std_dev: Some([0.0, 0.0, 0.0]),
        }),
        3 => SensorData::EkfNav1(EkfNav1 {
            time_stamp: time_stamp,
            velocity: Some([0.0, 0.0, 0.0]),
        }),
        4 => SensorData::EkfNav2(EkfNav2 {
            position: Some([0.0, 0.0, 0.0]),
            undulation: Some(0.0),
        }),
        5 => SensorData::EkfNavAcc(EkfNavAcc {
            status: EkfStatus::new(0),
            velocity_std_dev: Some([0.0, 0.0, 0.0]),
            position_std_dev: Some([0.0, 0.0, 0.0]),
        }),
        6 => SensorData::Imu1(Imu1 {
            time_stamp: time_stamp,
            status: ImuStatus::new(0),
            accelerometers: Some([0.0, 0.0, 0.0]),
            gyroscopes: Some([0.0, 0.0, 0.0]),
        }),
        7 => SensorData::Imu2(Imu2 {
            temperature: Some(0.0),
            delta_velocity: Some([0.0, 0.0, 0.0]),
            delta_angle: Some([0.0, 0.0, 0.0]),
        }),
        8 => SensorData::GpsVel(GpsVel {
            time_stamp: time_stamp,
            status: GpsVelStatus::new(0),
            velocity: Some([0.0, 0.0, 0.0]),
            time_of_week: Some(0),
            course: Some(0.0),
        }),
        9 => SensorData::GpsVelAcc(GpsVelAcc {
            course_acc: Some(0.0),
            velocity_acc: Some([0.0, 0.0, 0.0]),
        }),
        10 => SensorData::GpsPos1(GpsPos1 {
            latitude: Some(0.0),
            longitude: Some(0.0),
        }),
        11 => SensorData::GpsPos2(GpsPos2 {
            altitude: Some(0.0),
            undulation: Some(0.0),
            time_of_week: Some(0),
        }),
        12 => SensorData::GpsPosAcc(GpsPosAcc {
            time_stamp,
            status: GpsPositionStatus::new(0),
            latitude_accuracy: Some(0.0),
            longitude_accuracy: Some(0.0),
            altitude_accuracy: Some(0.0),
            num_sv_used: Some(0),
            base_station_id: Some(0),
            differential_age: Some(0),
        }),
        13 => SensorData::RecoverySensing(RecoverySensing {
            drogue_current: 0,
            main_current: 0,
            drogue_voltage: 0,
            main_voltage: 0,
        }),

        _ => panic!("Invalid sensor"),
    };
    let data = messages::Data::Sensor(Sensor::new(sensor_data));
    let msg = Message::new(
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as u32,
        messages::sender::Sender::GroundStation,
        data,
    );
    let mut buf = [0u8; 255];

    postcard::to_slice(&msg, &mut buf).unwrap();
    return buf;
}
