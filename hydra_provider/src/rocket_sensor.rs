use messages::sensor::{Sensor, UtcTime};

use sqlx::{postgres::PgQueryResult, Postgres, Transaction};

pub async fn db_save_rocket_sensor(
    sensor: Sensor,
    rocket_message_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let res: Result<PgQueryResult, sqlx::Error> = sqlx::query!(
        "INSERT INTO rocket_sensor_message
                        (rocket_message_id, component_id)
                        VALUES ($1, $2)",
        rocket_message_id,
        sensor.component_id as i32
    )
    .execute(&mut **transaction)
    .await;

    if res.is_err() {
        return Err(res.err().unwrap());
    }
    let sensor_data = sensor.data;

    return match sensor_data {
        messages::sensor::SensorData::UtcTime(time) => {
            add_utc_time(time, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::Air(air) => {
            add_air(air, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::EkfQuat(ekf_quat) => {
            add_rocket_quat(ekf_quat, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::EkfNav1(ekf_nav_1) => {
            add_rocket_nav_1(ekf_nav_1, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::EkfNav2(ekf_nav_2) => {
            add_rocket_nav_2(ekf_nav_2, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::Imu1(imu_1) => {
            add_imu_1(imu_1, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::Imu2(imu_2) => {
            add_imu_2(imu_2, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::GpsVel(gps_vel) => {
            add_gps_vel(gps_vel, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::GpsPos1(gps_pos_1) => {
            add_gps_pos_1(gps_pos_1, rocket_message_id, transaction).await
        }
        messages::sensor::SensorData::GpsPos2(gps_pos_2) => {
            add_gps_pos_2(gps_pos_2, rocket_message_id, transaction).await
        }
    };
}

async fn add_vec3(
    vec3: [f32; 3usize],
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<i32, sqlx::Error> {
    let id = sqlx::query!(
        "INSERT INTO data_vec3
        (x, y, z)
        VALUES ($1, $2, $3) RETURNING id",
        vec3[0],
        vec3[1],
        vec3[2]
    )
    .fetch_one(&mut **transaction)
    .await?
    .id;

    return Ok(id);
}

async fn add_quaternion(
    vec4: [f32; 4usize],
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<i32, sqlx::Error> {
    let id = sqlx::query!(
        "INSERT INTO data_quaternion
        (x, y, z, w)
        VALUES ($1, $2, $3, $4) RETURNING id",
        vec4[0],
        vec4[1],
        vec4[2],
        vec4[3]
    )
    .fetch_one(&mut **transaction)
    .await?
    .id;

    return Ok(id);
}

async fn add_utc_time(
    time: UtcTime,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_sensor_utc_time
        (rocket_sensor_message_id, time_stamp, status, year, month, day, hour, minute, second, nano_second, gps_time_of_week)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        rocket_command_id,
        time.time_stamp as i32,
        time.status as i32,
        time.year as i32,
        time.month as i32,
        time.day as i32,
        time.hour as i32,
        time.minute as i32,
        time.second as i32,
        time.nano_second as i32,
        time.gps_time_of_week as i32,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_air(
    air: messages::sensor::Air,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_sensor_air
        (rocket_sensor_message_id, time_stamp, status, pressure_abs, altitude, pressure_diff, true_airspeed, air_temperature)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        rocket_command_id,
        air.time_stamp as i32,
        air.status as i32,
        air.pressure_abs as f32,
        air.altitude as f32,
        air.pressure_diff as f32,
        air.true_airspeed as f32,
        air.air_temperature as f32,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_rocket_quat(
    ekf_quat: messages::sensor::EkfQuat,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let euler_std_dev = add_vec3(ekf_quat.euler_std_dev, transaction).await?;
    let quaternion = add_quaternion(ekf_quat.quaternion, transaction).await?;

    return sqlx::query!(
        "INSERT INTO rocket_sensor_quat
        (rocket_sensor_message_id, time_stamp, quaternion, euler_std_dev, status)
        VALUES ($1, $2, $3, $4, $5)",
        rocket_command_id,
        ekf_quat.time_stamp as i32,
        quaternion,
        euler_std_dev,
        ekf_quat.status as i32,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_rocket_nav_1(
    ekf_nav_1: messages::sensor::EkfNav1,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let velocity = add_vec3(ekf_nav_1.velocity, transaction).await?;
    let velocity_std_dev = add_vec3(ekf_nav_1.velocity_std_dev, transaction).await?;

    return sqlx::query!(
        "INSERT INTO rocket_sensor_nav_1
        (rocket_sensor_message_id, time_stamp, velocity, velocity_std_dev)
        VALUES ($1, $2, $3, $4)",
        rocket_command_id,
        ekf_nav_1.time_stamp as i32,
        velocity,
        velocity_std_dev,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_rocket_nav_2(
    ekf_nav_2: messages::sensor::EkfNav2,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let position = add_vec3(ekf_nav_2.position.map(|x| x as f32), transaction).await?;
    let position_std_dev = add_vec3(ekf_nav_2.position_std_dev, transaction).await?;

    return sqlx::query!(
        "INSERT INTO rocket_sensor_nav_2
        (rocket_sensor_message_id, position, position_std_dev, undulation, status)
        VALUES ($1, $2, $3, $4, $5)",
        rocket_command_id,
        position,
        position_std_dev,
        ekf_nav_2.undulation,
        ekf_nav_2.status as i32,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_imu_1(
    imu_1: messages::sensor::Imu1,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let accelerometers = add_vec3(imu_1.accelerometers, transaction).await?;
    let gyroscopes = add_vec3(imu_1.gyroscopes, transaction).await?;

    return sqlx::query!(
        "INSERT INTO rocket_sensor_imu_1
        (rocket_sensor_message_id, time_stamp, status, accelerometers, gyroscopes)
        VALUES ($1, $2, $3, $4, $5)",
        rocket_command_id,
        imu_1.time_stamp as i32,
        imu_1.status as i32,
        accelerometers,
        gyroscopes,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_imu_2(
    imu_2: messages::sensor::Imu2,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let delta_velocity = add_vec3(imu_2.delta_velocity, transaction).await?;
    let delta_angle = add_vec3(imu_2.delta_angle, transaction).await?;

    return sqlx::query!(
        "INSERT INTO rocket_sensor_imu_2
        (rocket_sensor_message_id, temperature, delta_velocity, delta_angle)
        VALUES ($1, $2, $3, $4)",
        rocket_command_id,
        imu_2.temperature as f32,
        delta_velocity,
        delta_angle,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_gps_vel(
    gps_vel: messages::sensor::GpsVel,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let velocity = add_vec3(gps_vel.velocity, transaction).await?;
    let velocity_acc = add_vec3(gps_vel.velocity_acc, transaction).await?;

    return sqlx::query!(
        "INSERT INTO rocket_sensor_gps_vel
        (rocket_sensor_message_id, time_stamp, status, time_of_week, velocity, velocity_acc, course, course_acc)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        rocket_command_id,
        gps_vel.time_stamp as i32,
        gps_vel.status as i32,
        gps_vel.time_of_week as i32,
        velocity,
        velocity_acc,
        gps_vel.course as f32,
        gps_vel.course_acc as f32,
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_gps_pos_1(
    gps_pos_1: messages::sensor::GpsPos1,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_sensor_gps_pos_1
        (rocket_sensor_message_id, time_stamp, status, time_of_week, latitude, longitude, altitude, undulation)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        rocket_command_id,
        gps_pos_1.time_stamp as i32,
        gps_pos_1.status as i32,
        gps_pos_1.time_of_week as i32,
        gps_pos_1.latitude as f32,
        gps_pos_1.longitude as f32,
        gps_pos_1.altitude as f32,
        gps_pos_1.undulation as f32,

    )
    .execute(&mut **transaction)
    .await;
}

async fn add_gps_pos_2(
    gps_pos_2: messages::sensor::GpsPos2,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_sensor_gps_pos_2
        (rocket_sensor_message_id, latitude_accuracy, longitude_accuracy, altitude_accuracy, num_sv_used, base_station_id, differential_age)
        VALUES ($1, $2, $3, $4, $5, $6, $7)",
        rocket_command_id,
        gps_pos_2.latitude_accuracy as f32,
        gps_pos_2.longitude_accuracy as f32,
        gps_pos_2.altitude_accuracy as f32,
        gps_pos_2.num_sv_used as i32,
        gps_pos_2.base_station_id as i32,
        gps_pos_2.differential_age as i32,
    )
    .execute(&mut **transaction)
    .await;
}
