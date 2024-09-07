use sqlx::postgres::PgQueryResult;
use sqlx::{Error, Postgres, Transaction};

pub trait SaveableData {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error>;
}
