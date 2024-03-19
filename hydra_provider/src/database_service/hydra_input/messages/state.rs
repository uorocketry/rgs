use crate::database_service::hydra_input::saveable::SaveableData;
use messages::state::State;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for State {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO rocket_state
				(rocket_message_id, state)
				VALUES ($1, $2)",
            rocket_message_id,
            format!("{:?}", *self)
        )
        .execute(&mut **transaction)
        .await
    }
}
