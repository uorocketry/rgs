use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::sensor::Sensor;
use crate::database_service::hydra_input::saveable::SaveableData;

impl SaveableData for Sensor {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		query!(
			"INSERT INTO rocket_sensor_message
			(rocket_message_id, component_id)
			VALUES ($1, $2)",
			rocket_message_id,
			self.component_id as i32
		)
		.execute(&mut **transaction)
		.await
	}
}