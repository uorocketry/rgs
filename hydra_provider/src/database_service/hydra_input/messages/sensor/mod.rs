pub mod air;
pub mod ekf_nav1;
pub mod ekf_nav2;
pub mod ekf_nav_acc;
pub mod ekf_quat;
pub mod gps_pos_acc;
pub mod gps_position1;
pub mod gps_position2;
pub mod gps_vel_acc;
pub mod gps_velocity;
pub mod imu1;
pub mod imu2;
pub mod utc_time;

use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::{Sensor, SensorData};
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for Sensor {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let result = query!(
            "INSERT INTO rocket_sensor_message
			(rocket_message_id)
			VALUES ($1)",
            rocket_message_id,
            // self.component_id as i32
        )
        .execute(&mut **transaction)
        .await;

        if result.is_err() {
            return Err(result.err().unwrap());
        }

        match &self.data {
            SensorData::UtcTime(data) => data.save(transaction, rocket_message_id).await,
            SensorData::Air(data) => data.save(transaction, rocket_message_id).await,
            SensorData::EkfQuat(data) => data.save(transaction, rocket_message_id).await,
            SensorData::EkfNav1(data) => data.save(transaction, rocket_message_id).await,
            SensorData::EkfNav2(data) => data.save(transaction, rocket_message_id).await,
            SensorData::Imu1(data) => data.save(transaction, rocket_message_id).await,
            SensorData::Imu2(data) => data.save(transaction, rocket_message_id).await,
            SensorData::GpsVel(data) => data.save(transaction, rocket_message_id).await,
            SensorData::GpsPos1(data) => data.save(transaction, rocket_message_id).await,
            SensorData::GpsPos2(data) => data.save(transaction, rocket_message_id).await,
            SensorData::EkfNavAcc(data) => data.save(transaction, rocket_message_id).await,
            SensorData::NavPosLlh(data) => data.save(transaction, rocket_message_id).await,
            SensorData::GpsVelAcc(data) => data.save(transaction, rocket_message_id).await,
            SensorData::ResetReason(data) => data.save(transaction, rocket_message_id).await,
            SensorData::GpsPosAcc(data) => data.save(transaction, rocket_message_id).await,
            SensorData::RecoverySensing(data) => data.save(transaction, rocket_message_id).await,
        }
    }
}
