use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::sensor::Imu1;
use crate::database_service::hydra_input::saveable::SaveableData;

use super::utils::store_3d_vector;

impl SaveableData for Imu1 {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		let accelerometers = store_3d_vector(self.accelerometers, transaction).await?;
		let gyroscopes = store_3d_vector(self.gyroscopes, transaction).await?;
	
		query!(
			"INSERT INTO rocket_sensor_imu_1
			(rocket_sensor_message_id, time_stamp, status, accelerometers, gyroscopes)
			VALUES ($1, $2, $3, $4, $5)",
			rocket_message_id,
			self.time_stamp as i32,
			self.status as i32,
			accelerometers,
			gyroscopes,
		)
		.execute(&mut **transaction)
		.await
	}
}

