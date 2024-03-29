use crate::database_service::hydra_input::saveable::SaveableData;
use messages::command::PowerDown;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for PowerDown {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_command_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO rocket_power_down_command
				(rocket_command_id, board)
				VALUES ($1, $2)",
            rocket_command_id,
            format!("{:?}", self.board)
        )
        .execute(&mut **transaction)
        .await
    }
}
