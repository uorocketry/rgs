use crate::hydra_input::saveable::SaveableData;
use messages::Log;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for Log {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO rocket_log
				(rocket_message_id, level, event)
				VALUES ($1, $2, $3)",
            rocket_message_id,
            format!("{:?}", self.level),
            format!("{:?}", self.event)
        )
        .execute(&mut **transaction)
        .await
    }
}
