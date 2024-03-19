use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::sensor::EkfNav1;
use crate::database_service::hydra_input::saveable::SaveableData;
use super::utils::store_3d_vector;

impl SaveableData for EkfNav1 {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		let velocity = store_3d_vector(self.velocity, transaction).await?;
		let velocity_std_dev: i32 = store_3d_vector(self.velocity_std_dev, transaction).await?;
		query!(
			"INSERT INTO rocket_sensor_nav_1
			(rocket_sensor_message_id, time_stamp, velocity, velocity_std_dev)
			VALUES ($1, $2, $3, $4)",
			rocket_message_id,
			self.time_stamp as i32,
			velocity,
			velocity_std_dev,
		)
		.execute(&mut **transaction)
		.await
	}
}

