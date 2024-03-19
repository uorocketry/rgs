use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::sensor::Imu2;
use crate::database_service::hydra_input::saveable::SaveableData;

use super::utils::store_3d_vector;

impl SaveableData for Imu2 {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		let delta_velocity = store_3d_vector(self.delta_velocity, transaction).await?;
		let delta_angle = store_3d_vector(self.delta_angle, transaction).await?;

		query!(
			"INSERT INTO rocket_sensor_imu_2
			(rocket_sensor_message_id, temperature, delta_velocity, delta_angle)
			VALUES ($1, $2, $3, $4)",
			rocket_message_id,
			self.temperature as f32,
			delta_velocity,
			delta_angle,
		)
		.execute(&mut **transaction)
		.await
	}
}
