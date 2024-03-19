use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::sensor::EkfQuat;
use crate::database_service::hydra_input::saveable::SaveableData;

use super::utils::{store_3d_vector, store_quaternion};

impl SaveableData for EkfQuat {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		let euler_std_dev = store_3d_vector(self.euler_std_dev, transaction).await?;
		let quaternion = store_quaternion(self.quaternion, transaction).await?;

		query!(
			"INSERT INTO rocket_sensor_quat
			(rocket_sensor_message_id, time_stamp, quaternion, euler_std_dev, status)
			VALUES ($1, $2, $3, $4, $5)",
			rocket_message_id,
			self.time_stamp as i32,
			quaternion,
			euler_std_dev,
			self.status as i32,
		)
		.execute(&mut **transaction)
		.await
	}
}

