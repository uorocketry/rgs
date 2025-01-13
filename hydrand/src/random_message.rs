use mavlink::uorocketry::MavMessage;
use messages::{
    mavlink,
    sensor::{Air, EkfNav, EkfQuat, GpsPos, GpsVel, Imu, UtcTime},
    sensor_status::{
        AirStatus, EkfStatus, GpsPositionStatus, GpsVelStatus, ImuStatus, UtcTimeStatus,
    },
    state::State,
    FormattedNaiveDateTime, RadioData,
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
        0 => State::Initializing,
        1 => State::WaitForTakeoff,
        2 => State::Ascent,
        3 => State::Descent,
        4 => State::TerminalDescent,
        5 => State::WaitForRecovery,
        6 => State::Abort,
        _ => panic!("Invalid state"),
    };
    let data = State::from(state_data);

    let msg = messages::RadioMessage::new(
        FormattedNaiveDateTime {
            0: chrono::Utc::now().naive_utc(),
        },
        // TODO: Replace by Appropriate node when it is implemented
        messages::node::Node::PressureBoard,
        RadioData::Common(messages::Common::State(data)),
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

    let random_sensor = rand::thread_rng().gen_range(0..=6);

    let sensor_data = match random_sensor {
        0 => messages::sensor::SbgData::UtcTime(UtcTime {
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
        1 => messages::sensor::SbgData::Air(Air {
            time_stamp: time_stamp,
            pressure_abs: Some(0.0),
            altitude: Some(rand::thread_rng().gen_range(0.0..10000.0)),
            pressure_diff: Some(0.0),
            true_airspeed: Some(0.0),
            air_temperature: Some(0.0),
            status: AirStatus::new(0),
        }),
        2 => messages::sensor::SbgData::EkfQuat(EkfQuat {
            time_stamp: time_stamp,
            status: EkfStatus::new(0),
            quaternion: Some([0.0, 0.0, 0.0, 0.0]),
            euler_std_dev: Some([0.0, 0.0, 0.0]),
        }),
        3 => messages::sensor::SbgData::EkfNav(EkfNav {
            time_stamp: time_stamp,
            velocity: Some([0.0, 0.0, 0.0]),
            position: Some([0.0, 0.0, 0.0]),
            undulation: Some(0.0),
            status: EkfStatus::new(0),
            velocity_std_dev: Some([0.0, 0.0, 0.0]),
            position_std_dev: Some([0.0, 0.0, 0.0]),
        }),
        4 => messages::sensor::SbgData::Imu(Imu {
            time_stamp: time_stamp,
            status: ImuStatus::new(0),
            accelerometers: Some([0.0, 0.0, 0.0]),
            gyroscopes: Some([0.0, 0.0, 0.0]),
            temperature: Some(0.0),
            delta_velocity: Some([0.0, 0.0, 0.0]),
            delta_angle: Some([0.0, 0.0, 0.0]),
        }),
        5 => messages::sensor::SbgData::GpsVel(GpsVel {
            time_stamp: time_stamp,
            status: GpsVelStatus::new(0),
            velocity: Some([0.0, 0.0, 0.0]),
            time_of_week: Some(0),
            course: Some(0.0),
            course_acc: Some(0.0),
            velocity_acc: Some([0.0, 0.0, 0.0]),
        }),
        6 => messages::sensor::SbgData::GpsPos(GpsPos {
            latitude: Some(0.0),
            longitude: Some(0.0),
            altitude: Some(0.0),
            undulation: Some(0.0),
            time_of_week: Some(0),
            time_stamp,
            status: GpsPositionStatus::new(0),
            latitude_accuracy: Some(0.0),
            longitude_accuracy: Some(0.0),
            altitude_accuracy: Some(0.0),
            num_sv_used: Some(0),
            base_station_id: Some(0),
            differential_age: Some(0),
        }),

        _ => panic!("Invalid sensor"),
    };
    let msg = messages::RadioMessage::new(
        FormattedNaiveDateTime {
            0: chrono::Utc::now().naive_utc(),
        },
        // TODO: Replace by Appropriate node when it is implemented
        messages::node::Node::PressureBoard,
        RadioData::Sbg(sensor_data),
    );

    let mut buf = [0u8; 255];

    postcard::to_slice(&msg, &mut buf).unwrap();
    return buf;
}
