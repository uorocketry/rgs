use anyhow::Error;
use csv::Writer;
use std::sync::mpsc::Sender;

use messages::{sensor, Data, Message};
use std::io::Read;
use std::path::Path;

use postcard::from_bytes;

use crate::processing::InputData;
pub struct FileInput {
    file_path: String,
}

impl FileInput {
    // reads from file
    pub fn new(file_path: String) -> Self {
        FileInput { file_path }
    }
}

impl FileInput {
    // This is implementation has a higher number of resets with 3459 resets but the data has a better distribution

    // This implementation has a lower number of resets with 117 resets but the data has a worse distribution

    pub fn process_file(&self, send: Sender<InputData>) -> Result<(), Error> {
        let path = Path::new(&self.file_path);
        let mut f = std::fs::File::open(path)?;

        let mut file_buf: Vec<u8> = Vec::new();
        f.read_to_end(&mut file_buf)?;

        let mut buffer: Vec<u8> = Vec::new();
        let mut is_first = true;
        let mut air_wtr = Writer::from_path("air.csv")?;
        let mut imu1_wtr = Writer::from_path("imu1.csv")?;
        let mut imu2_wtr = Writer::from_path("imu2.csv")?;
        let mut gpsvel_wtr = Writer::from_path("gpsvel.csv")?;
        let mut gpspos1_wtr = Writer::from_path("gpspos.csv")?;
        let mut gpspos2_wtr = Writer::from_path("gpspos2.csv")?;
        let mut ekfnav1_wtr = Writer::from_path("ekfnav1.csv")?;
        let mut ekfnav2_wtr = Writer::from_path("ekfnav2.csv")?;
        let mut ekfquat_wtr = Writer::from_path("ekfquat.csv")?;

        for i in 0..file_buf.len() {
            if buffer.len() < 64 {
                buffer.push(file_buf[i]);
            } else if buffer.len() == 64 {
                let data: Result<Message, postcard::Error> = from_bytes(&buffer);
                match data {
                    Ok(msg) => {
                        if is_first {
                            is_first = false;
                            air_wtr.write_record(&[
                                "time_stamp",
                                "status",
                                "pressure_abs",
                                "altitude",
                                "pressure_diff",
                                "true_airspeed",
                                "air_temperature",
                            ])?;
                            imu1_wtr.write_record(&[
                                "time_stamp",
                                "status",
                                "accelerometers[0]",
                                "accelerometers[1]",
                                "accelerometers[2]",
                                "gyroscopes[0]",
                                "gyroscopes[1]",
                                "gyroscopes[2]",
                            ])?;
                            imu2_wtr.write_record(&[
                                "time_stamp",
                                "temperature",
                                "delta_velocity[0]",
                                "delta_velocity[1]",
                                "delta_velocity[2]",
                                "delta_angle[0]",
                                "delta_angle[1]",
                                "delta_angle[2]",
                            ])?;
                            gpsvel_wtr.write_record(&[
                                "time_stamp",
                                "status",
                                "time_of_week",
                                "velocity[0]",
                                "velocity[1]",
                                "velocity[2]",
                                "velocity_acc[0]",
                                "velocity_acc[1]",
                                "velocity_acc[2]",
                                "course",
                                "course_acc",
                            ])?;
                            gpspos1_wtr.write_record(&[
                                "time_stamp",
                                "status",
                                "timeOfWeek",
                                "latitude",
                                "longitude",
                                "altitude",
                                "undulation",
                            ])?;
                            gpspos2_wtr.write_record(&[
                                "time_stamp",
                                "latitudeAccuracy",
                                "longitudeAccuracy",
                                "altitudeAccuracy",
                                "numSvUsed",
                                "baseStationId",
                                "differentialAge",
                            ])?;
                            ekfnav1_wtr.write_record(&[
                                "time_stamp",
                                "velocity[0]",
                                "velocity[1]",
                                "velocity[2]",
                                "velocity_std_dev[0]",
                                "velocity_std_dev[1]",
                                "velocity_std_dev[2]",
                            ])?;
                            ekfnav2_wtr.write_record(&[
                                "time_stamp",
                                "status",
                                "position[0]",
                                "position[1]",
                                "position[2]",
                                "position_std_dev[0]",
                                "position_std_dev[1]",
                                "position_std_dev[2]",
                            ])?;
                        }

                        match msg.clone().data {
                            Data::Sensor(sensor_data) => match sensor_data.data {
                                sensor::SensorData::Air(air_data) => {
                                    air_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &air_data.status.to_string(),
                                        &air_data.pressure_abs.to_string(),
                                        &air_data.altitude.to_string(),
                                        &air_data.pressure_diff.to_string(),
                                        &air_data.true_airspeed.to_string(),
                                        &air_data.air_temperature.to_string(),
                                    ])?;
                                }
                                sensor::SensorData::Imu1(imu1_data) => {
                                    imu1_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &imu1_data.status.to_string(),
                                        &imu1_data.accelerometers[0].to_string(),
                                        &imu1_data.accelerometers[1].to_string(),
                                        &imu1_data.accelerometers[2].to_string(),
                                        &imu1_data.gyroscopes[0].to_string(),
                                        &imu1_data.gyroscopes[1].to_string(),
                                        &imu1_data.gyroscopes[2].to_string(),
                                    ])?;
                                }
                                sensor::SensorData::Imu2(imu2_data) => {
                                    imu2_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &imu2_data.temperature.to_string(),
                                        &imu2_data.delta_velocity[0].to_string(),
                                        &imu2_data.delta_velocity[1].to_string(),
                                        &imu2_data.delta_velocity[2].to_string(),
                                        &imu2_data.delta_angle[0].to_string(),
                                        &imu2_data.delta_angle[1].to_string(),
                                        &imu2_data.delta_angle[2].to_string(),
                                    ])?;
                                }
                                sensor::SensorData::GpsVel(gpsvel_data) => {
                                    gpsvel_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &gpsvel_data.status.to_string(),
                                        &gpsvel_data.time_of_week.to_string(),
                                        &gpsvel_data.velocity[0].to_string(),
                                        &gpsvel_data.velocity[1].to_string(),
                                        &gpsvel_data.velocity[2].to_string(),
                                        &gpsvel_data.velocity_acc[0].to_string(),
                                        &gpsvel_data.velocity_acc[1].to_string(),
                                        &gpsvel_data.velocity_acc[2].to_string(),
                                        &gpsvel_data.course.to_string(),
                                        &gpsvel_data.course_acc.to_string(),
                                    ])?;
                                }
                                sensor::SensorData::GpsPos1(gpspos1_data) => {
                                    gpspos1_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &gpspos1_data.status.to_string(),
                                        &gpspos1_data.time_of_week.to_string(),
                                        &gpspos1_data.latitude.to_string(),
                                        &gpspos1_data.longitude.to_string(),
                                        &gpspos1_data.altitude.to_string(),
                                        &gpspos1_data.undulation.to_string(),
                                    ])?;
                                }
                                sensor::SensorData::GpsPos2(gpspos2_data) => {
                                    gpspos2_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &gpspos2_data.latitude_accuracy.to_string(),
                                        &gpspos2_data.longitude_accuracy.to_string(),
                                        &gpspos2_data.altitude_accuracy.to_string(),
                                        &gpspos2_data.num_sv_used.to_string(),
                                        &gpspos2_data.base_station_id.to_string(),
                                        &gpspos2_data.differential_age.to_string(),
                                    ])?;
                                }
                                sensor::SensorData::EkfNav1(ekfnav1_data) => {
                                    ekfnav1_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &ekfnav1_data.velocity[0].to_string(),
                                        &ekfnav1_data.velocity[1].to_string(),
                                        &ekfnav1_data.velocity[2].to_string(),
                                        &ekfnav1_data.velocity_std_dev[0].to_string(),
                                        &ekfnav1_data.velocity_std_dev[1].to_string(),
                                        &ekfnav1_data.velocity_std_dev[2].to_string(),
                                    ])?;
                                }
                                sensor::SensorData::EkfNav2(ekfnav2_data) => {
                                    ekfnav2_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &ekfnav2_data.status.to_string(),
                                        &ekfnav2_data.position[0].to_string(),
                                        &ekfnav2_data.position[1].to_string(),
                                        &ekfnav2_data.position[2].to_string(),
                                        &ekfnav2_data.position_std_dev[0].to_string(),
                                        &ekfnav2_data.position_std_dev[1].to_string(),
                                        &ekfnav2_data.position_std_dev[2].to_string(),
                                    ])?;
                                }
                                sensor::SensorData::EkfQuat(ekfquat_data) => {
                                    ekfquat_wtr.write_record(&[
                                        &msg.timestamp.to_string(),
                                        &ekfquat_data.status.to_string(),
                                        &ekfquat_data.quaternion[0].to_string(),
                                        &ekfquat_data.quaternion[1].to_string(),
                                        &ekfquat_data.quaternion[2].to_string(),
                                        &ekfquat_data.quaternion[3].to_string(),
                                        &ekfquat_data.euler_std_dev[0].to_string(),
                                        &ekfquat_data.euler_std_dev[1].to_string(),
                                        &ekfquat_data.euler_std_dev[2].to_string(),
                                    ])?;
                                }
                                _ => {}
                            },
                            _ => {}
                        }

                        send.send(InputData::RocketData(msg)).unwrap();
                        buffer.clear();
                        air_wtr.flush()?;
                        imu1_wtr.flush()?;
                        imu2_wtr.flush()?;
                        gpsvel_wtr.flush()?;
                        gpspos1_wtr.flush()?;
                        gpspos2_wtr.flush()?;
                        ekfnav1_wtr.flush()?;
                        ekfnav2_wtr.flush()?;
                        ekfquat_wtr.flush()?;
                        std::thread::sleep(std::time::Duration::from_millis(100));
                    }
                    Err(_) => {
                        // Error occurred, discard bytes until next valid message
                        while !buffer.is_empty() {
                            buffer.remove(0);
                            if buffer.len() == 64 && from_bytes::<Message>(&buffer).is_ok() {
                                break;
                            }
                        }
                    }
                }
            }
        }
        Ok(())
    }
}
