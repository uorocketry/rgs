use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::command::RadioRateChange;
use crate::database_service::hydra_input::saveable::SaveableData;

impl SaveableData for RadioRateChange {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_command_id: i32,
	) -> Result<PgQueryResult, Error> {
		query!(
			"INSERT INTO rocket_radio_rate_change_command
				(rocket_command_id, rate)
				VALUES ($1, $2)",
			rocket_command_id,
			format!("{:?}", self.rate)
		)
		.execute(&mut **transaction)
		.await
	}
}