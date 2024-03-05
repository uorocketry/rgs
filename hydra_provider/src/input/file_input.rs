use csv::Writer;

use messages::{sensor, Data};
use std::path::Path;
use std::{fs::File, io::Read};

use postcard::from_bytes;

use crate::hydra_iterator::HydraInput;

pub fn process_file(file_path: String) -> Box<dyn Iterator<Item = HydraInput> + Send> {
    let mut file_buf: Vec<u8> = Vec::new();
    std::fs::File::open(Path::new(&file_path))
        .unwrap()
        .read_to_end(&mut file_buf)
        .unwrap();

    let air_wtr = Writer::from_path("air.csv").unwrap();
    let imu1_wtr = Writer::from_path("imu1.csv").unwrap();
    let imu2_wtr = Writer::from_path("imu2.csv").unwrap();
    let gpsvel_wtr = Writer::from_path("gpsvel.csv").unwrap();
    let gpspos1_wtr = Writer::from_path("gpspos.csv").unwrap();
    let gpspos2_wtr = Writer::from_path("gpspos2.csv").unwrap();
    let ekfnav1_wtr = Writer::from_path("ekfnav1.csv").unwrap();
    let ekfnav2_wtr = Writer::from_path("ekfnav2.csv").unwrap();
    let ekfquat_wtr = Writer::from_path("ekfquat.csv").unwrap();

    struct IteratorObj {
        is_first: bool,
        air_wtr: Writer<File>,
        imu1_wtr: Writer<File>,
        imu2_wtr: Writer<File>,
        gpsvel_wtr: Writer<File>,
        gpspos1_wtr: Writer<File>,
        gpspos2_wtr: Writer<File>,
        ekfnav1_wtr: Writer<File>,
        ekfnav2_wtr: Writer<File>,
        ekfquat_wtr: Writer<File>,
        remaining_buf_len: usize,
        buffer: Vec<u8>,
        file_buf: Vec<u8>,
    }

    impl Iterator for IteratorObj {
        type Item = HydraInput;

        fn next(&mut self) -> Option<Self::Item> {
            if self.remaining_buf_len == 0 {
                return None;
            }

            if self.buffer.len() < 64 {
                self.buffer.push(self.file_buf[self.remaining_buf_len - 1]);
            } else if self.buffer.len() == 64 {
                let data: Result<messages::Message, postcard::Error> = from_bytes(&self.buffer);
                // if data is error return error
                if data.clone().is_err() {
                    // Error occurred, discard bytes until next valid message
                    while !self.buffer.is_empty() {
                        self.buffer.remove(0);
                        if self.buffer.len() == 64
                            && from_bytes::<messages::Message>(&self.buffer).is_ok()
                        {
                            break;
                        }
                    }
                }

                if self.is_first {
                    self.is_first = false;
                    self.air_wtr
                        .write_record(&[
                            "time_stamp",
                            "status",
                            "pressure_abs",
                            "altitude",
                            "pressure_diff",
                            "true_airspeed",
                            "air_temperature",
                        ])
                        .unwrap();
                    self.imu1_wtr
                        .write_record(&[
                            "time_stamp",
                            "status",
                            "accelerometers[0]",
                            "accelerometers[1]",
                            "accelerometers[2]",
                            "gyroscopes[0]",
                            "gyroscopes[1]",
                            "gyroscopes[2]",
                        ])
                        .unwrap();
                    self.imu2_wtr
                        .write_record(&[
                            "time_stamp",
                            "temperature",
                            "delta_velocity[0]",
                            "delta_velocity[1]",
                            "delta_velocity[2]",
                            "delta_angle[0]",
                            "delta_angle[1]",
                            "delta_angle[2]",
                        ])
                        .unwrap();
                    self.gpsvel_wtr
                        .write_record(&[
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
                        ])
                        .unwrap();
                    self.gpspos1_wtr
                        .write_record(&[
                            "time_stamp",
                            "status",
                            "timeOfWeek",
                            "latitude",
                            "longitude",
                            "altitude",
                            "undulation",
                        ])
                        .unwrap();
                    self.gpspos2_wtr
                        .write_record(&[
                            "time_stamp",
                            "latitudeAccuracy",
                            "longitudeAccuracy",
                            "altitudeAccuracy",
                            "numSvUsed",
                            "baseStationId",
                            "differentialAge",
                        ])
                        .unwrap();
                    self.ekfnav1_wtr
                        .write_record(&[
                            "time_stamp",
                            "velocity[0]",
                            "velocity[1]",
                            "velocity[2]",
                            "velocity_std_dev[0]",
                            "velocity_std_dev[1]",
                            "velocity_std_dev[2]",
                        ])
                        .unwrap();
                    self.ekfnav2_wtr
                        .write_record(&[
                            "time_stamp",
                            "status",
                            "position[0]",
                            "position[1]",
                            "position[2]",
                            "position_std_dev[0]",
                            "position_std_dev[1]",
                            "position_std_dev[2]",
                        ])
                        .unwrap();
                }

                let data_ok = data.clone().unwrap();

                match data.clone().unwrap().data {
                    Data::Sensor(sensor_data) => match sensor_data.data {
                        sensor::SensorData::Air(air_data) => {
                            self.air_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &air_data.status.to_string(),
                                    &air_data.pressure_abs.to_string(),
                                    &air_data.altitude.to_string(),
                                    &air_data.pressure_diff.to_string(),
                                    &air_data.true_airspeed.to_string(),
                                    &air_data.air_temperature.to_string(),
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::Imu1(imu1_data) => {
                            self.imu1_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &imu1_data.status.to_string(),
                                    &imu1_data.accelerometers[0].to_string(),
                                    &imu1_data.accelerometers[1].to_string(),
                                    &imu1_data.accelerometers[2].to_string(),
                                    &imu1_data.gyroscopes[0].to_string(),
                                    &imu1_data.gyroscopes[1].to_string(),
                                    &imu1_data.gyroscopes[2].to_string(),
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::Imu2(imu2_data) => {
                            self.imu2_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &imu2_data.temperature.to_string(),
                                    &imu2_data.delta_velocity[0].to_string(),
                                    &imu2_data.delta_velocity[1].to_string(),
                                    &imu2_data.delta_velocity[2].to_string(),
                                    &imu2_data.delta_angle[0].to_string(),
                                    &imu2_data.delta_angle[1].to_string(),
                                    &imu2_data.delta_angle[2].to_string(),
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::GpsVel(gpsvel_data) => {
                            self.gpsvel_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
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
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::GpsPos1(gpspos1_data) => {
                            self.gpspos1_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &gpspos1_data.status.to_string(),
                                    &gpspos1_data.time_of_week.to_string(),
                                    &gpspos1_data.latitude.to_string(),
                                    &gpspos1_data.longitude.to_string(),
                                    &gpspos1_data.altitude.to_string(),
                                    &gpspos1_data.undulation.to_string(),
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::GpsPos2(gpspos2_data) => {
                            self.gpspos2_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &gpspos2_data.latitude_accuracy.to_string(),
                                    &gpspos2_data.longitude_accuracy.to_string(),
                                    &gpspos2_data.altitude_accuracy.to_string(),
                                    &gpspos2_data.num_sv_used.to_string(),
                                    &gpspos2_data.base_station_id.to_string(),
                                    &gpspos2_data.differential_age.to_string(),
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::EkfNav1(ekfnav1_data) => {
                            self.ekfnav1_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &ekfnav1_data.velocity[0].to_string(),
                                    &ekfnav1_data.velocity[1].to_string(),
                                    &ekfnav1_data.velocity[2].to_string(),
                                    &ekfnav1_data.velocity_std_dev[0].to_string(),
                                    &ekfnav1_data.velocity_std_dev[1].to_string(),
                                    &ekfnav1_data.velocity_std_dev[2].to_string(),
                                ])
                                .unwrap();
                        }
                        sensor::SensorData::EkfNav2(ekfnav2_data) => self
                            .ekfnav2_wtr
                            .write_record(&[
                                &data_ok.timestamp.to_string(),
                                &ekfnav2_data.status.to_string(),
                                &ekfnav2_data.position[0].to_string(),
                                &ekfnav2_data.position[1].to_string(),
                                &ekfnav2_data.position[2].to_string(),
                                &ekfnav2_data.position_std_dev[0].to_string(),
                                &ekfnav2_data.position_std_dev[1].to_string(),
                                &ekfnav2_data.position_std_dev[2].to_string(),
                            ])
                            .unwrap(),
                        sensor::SensorData::EkfQuat(ekfquat_data) => {
                            self.ekfquat_wtr
                                .write_record(&[
                                    &data_ok.timestamp.to_string(),
                                    &ekfquat_data.status.to_string(),
                                    &ekfquat_data.quaternion[0].to_string(),
                                    &ekfquat_data.quaternion[1].to_string(),
                                    &ekfquat_data.quaternion[2].to_string(),
                                    &ekfquat_data.quaternion[3].to_string(),
                                    &ekfquat_data.euler_std_dev[0].to_string(),
                                    &ekfquat_data.euler_std_dev[1].to_string(),
                                    &ekfquat_data.euler_std_dev[2].to_string(),
                                ])
                                .unwrap();
                        }
                        _ => {}
                    },
                    _ => {}
                }

                self.buffer.clear();
                self.air_wtr.flush().unwrap();
                self.imu1_wtr.flush().unwrap();
                self.imu2_wtr.flush().unwrap();
                self.gpsvel_wtr.flush().unwrap();
                self.gpspos1_wtr.flush().unwrap();
                self.gpspos2_wtr.flush().unwrap();
                self.ekfnav1_wtr.flush().unwrap();
                self.ekfnav2_wtr.flush().unwrap();
                self.ekfquat_wtr.flush().unwrap();

                return Some(HydraInput::RocketData(data_ok));
            }

            None
        }
    }

    return Box::from(IteratorObj {
        is_first: true,
        air_wtr,
        imu1_wtr,
        imu2_wtr,
        gpsvel_wtr,
        gpspos1_wtr,
        gpspos2_wtr,
        ekfnav1_wtr,
        ekfnav2_wtr,
        ekfquat_wtr,
        remaining_buf_len: file_buf.len(),
        buffer: Vec::new(),
        file_buf: file_buf,
    });
}
