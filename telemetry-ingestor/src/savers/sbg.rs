use libsql::{params, Result, Transaction};
use messages::sensor::SbgData;

pub async fn save_sbg(transaction: &Transaction, sbg: &SbgData) -> Result<i64> {
    // Save the specific subtype
    let data_id: i64 = match sbg {
        SbgData::UtcTime(utc_time) => {
            let status_to_string = serde_json::to_string(&utc_time.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgUtcTime (time_stamp, status, year, month, day, hour, minute, second, nano_second, gps_time_of_week)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params![
                        utc_time.time_stamp,
                        status_to_string,
                        utc_time.year,
                        utc_time.month,
                        utc_time.day,
                        utc_time.hour,
                        utc_time.minute,
                        utc_time.second,
                        utc_time.nano_second,
                        utc_time.gps_time_of_week,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        SbgData::Air(air) => {
            let status_to_string = serde_json::to_string(&air.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgAir (time_stamp, status, pressure_abs, altitude, pressure_diff, true_airspeed, air_temperature)
                     VALUES (?, ?, ?, ?, ?, ?, ?)",
                    params![
                        air.time_stamp,
                        status_to_string,
                        air.pressure_abs,
                        air.altitude,
                        air.pressure_diff,
                        air.true_airspeed,
                        air.air_temperature,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        SbgData::EkfQuat(ekf_quat) => {
            let status_to_string = serde_json::to_string(&ekf_quat.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgEkfQuat (time_stamp, quaternion_w, quaternion_x, quaternion_y, quaternion_z, euler_std_dev_roll, euler_std_dev_pitch, euler_std_dev_yaw, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params![
                        ekf_quat.time_stamp,
                        ekf_quat.quaternion.map_or(None, |q| Some(q[0])),
                        ekf_quat.quaternion.map_or(None, |q| Some(q[1])),
                        ekf_quat.quaternion.map_or(None, |q| Some(q[2])),
                        ekf_quat.quaternion.map_or(None, |q| Some(q[3])),
                        ekf_quat.euler_std_dev.map_or(None, |e| Some(e[0])),
                        ekf_quat.euler_std_dev.map_or(None, |e| Some(e[1])),
                        ekf_quat.euler_std_dev.map_or(None, |e| Some(e[2])),
                        status_to_string,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        SbgData::EkfNav(ekf_nav) => {
            let status_to_string = serde_json::to_string(&ekf_nav.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgEkfNav (time_stamp, status, velocity_north, velocity_east, velocity_down, velocity_std_dev_north, velocity_std_dev_east, velocity_std_dev_down, position_latitude, position_longitude, position_altitude, position_std_dev_latitude, position_std_dev_longitude, position_std_dev_altitude, undulation)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params![
                        ekf_nav.time_stamp,
                        status_to_string,
                        ekf_nav.velocity.map_or(None, |v| Some(v[0])),
                        ekf_nav.velocity.map_or(None, |v| Some(v[1])),
                        ekf_nav.velocity.map_or(None, |v| Some(v[2])),
                        ekf_nav.velocity_std_dev.map_or(None, |v| Some(v[0])),
                        ekf_nav.velocity_std_dev.map_or(None, |v| Some(v[1])),
                        ekf_nav.velocity_std_dev.map_or(None, |v| Some(v[2])),
                        ekf_nav.position.map_or(None, |p| Some(p[0])),
                        ekf_nav.position.map_or(None, |p| Some(p[1])),
                        ekf_nav.position.map_or(None, |p| Some(p[2])),
                        ekf_nav.position_std_dev.map_or(None, |p| Some(p[0])),
                        ekf_nav.position_std_dev.map_or(None, |p| Some(p[1])),
                        ekf_nav.position_std_dev.map_or(None, |p| Some(p[2])),
                        ekf_nav.undulation,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        SbgData::Imu(imu) => {
            let status_to_string = serde_json::to_string(&imu.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgImu (time_stamp, status, accelerometer_x, accelerometer_y, accelerometer_z, gyroscope_x, gyroscope_y, gyroscope_z, delta_velocity_x, delta_velocity_y, delta_velocity_z, delta_angle_x, delta_angle_y, delta_angle_z, temperature)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params![
                        imu.time_stamp,
                        status_to_string,
                        imu.accelerometers.map_or(None, |a| Some(a[0])),
                        imu.accelerometers.map_or(None, |a| Some(a[1])),
                        imu.accelerometers.map_or(None, |a| Some(a[2])),
                        imu.gyroscopes.map_or(None, |g| Some(g[0])),
                        imu.gyroscopes.map_or(None, |g| Some(g[1])),
                        imu.gyroscopes.map_or(None, |g| Some(g[2])),
                        imu.delta_velocity.map_or(None, |d| Some(d[0])),
                        imu.delta_velocity.map_or(None, |d| Some(d[1])),
                        imu.delta_velocity.map_or(None, |d| Some(d[2])),
                        imu.delta_angle.map_or(None, |d| Some(d[0])),
                        imu.delta_angle.map_or(None, |d| Some(d[1])),
                        imu.delta_angle.map_or(None, |d| Some(d[2])),
                        imu.temperature,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        SbgData::GpsVel(gps_vel) => {
            let status_to_string = serde_json::to_string(&gps_vel.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgGpsVel (time_stamp, status, velocity_north, velocity_east, velocity_down, velocity_acc_north, velocity_acc_east, velocity_acc_down, course, course_acc, time_of_week)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params![
                        gps_vel.time_stamp,
                        status_to_string,
                        gps_vel.velocity.map_or(None, |v| Some(v[0])),
                        gps_vel.velocity.map_or(None, |v| Some(v[1])),
                        gps_vel.velocity.map_or(None, |v| Some(v[2])),
                        gps_vel.velocity_acc.map_or(None, |v| Some(v[0])),
                        gps_vel.velocity_acc.map_or(None, |v| Some(v[1])),
                        gps_vel.velocity_acc.map_or(None, |v| Some(v[2])),
                        gps_vel.course,
                        gps_vel.course_acc,
                        gps_vel.time_of_week,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        SbgData::GpsPos(gps_pos) => {
            let status_to_string = serde_json::to_string(&gps_pos.status)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();
            transaction
                .execute(
                    "INSERT INTO SbgGpsPos (time_stamp, status, latitude, latitude_accuracy, longitude, longitude_accuracy, altitude, altitude_accuracy, undulation, num_sv_used, base_station_id, differential_age, time_of_week)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    params![
                        gps_pos.time_stamp,
                        status_to_string,
                        gps_pos.latitude,
                        gps_pos.latitude_accuracy,
                        gps_pos.longitude,
                        gps_pos.longitude_accuracy,
                        gps_pos.altitude,
                        gps_pos.altitude_accuracy,
                        gps_pos.undulation,
                        gps_pos.num_sv_used,
                        gps_pos.base_station_id,
                        gps_pos.differential_age,
                        gps_pos.time_of_week,
                    ],
                )
                .await?;
            transaction.last_insert_rowid()
        }
    };

    Ok(data_id)
}
