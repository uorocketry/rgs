use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::command::DeployDrogue;
use crate::database_service::hydra_input::saveable::SaveableData;

impl SaveableData for DeployDrogue {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_command_id: i32,
	) -> Result<PgQueryResult, Error> {
		query!(
			"INSERT INTO rocket_deploy_drogue_command
				(rocket_command_id, val)
				VALUES ($1, $2)",
			rocket_command_id,
			self.val
		)
		.execute(&mut **transaction)
		.await
	}
}