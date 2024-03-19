use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsVel;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

use super::utils::store_3d_vector;

impl SaveableData for GpsVel {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let velocity = store_3d_vector(self.velocity, transaction).await?;
        let velocity_acc = store_3d_vector(self.velocity_acc, transaction).await?;

        query!(
			"INSERT INTO rocket_sensor_gps_vel
			(rocket_sensor_message_id, time_stamp, status, time_of_week, velocity, velocity_acc, course, course_acc)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			rocket_message_id,
			self.time_stamp as i32,
			self.status as i32,
			self.time_of_week as i32,
			velocity,
			velocity_acc,
			self.course as f32,
			self.course_acc as f32,
		)
		.execute(&mut **transaction)
		.await
    }
}
