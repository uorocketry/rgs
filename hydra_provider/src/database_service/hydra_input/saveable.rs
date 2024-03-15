use sqlx::{Postgres, Transaction, Error};
use sqlx::postgres::PgQueryResult;


pub trait SaveableData {
	async fn save(&self, transaction: &mut Transaction<'_, Postgres>, rocket_message_id: i32) -> Result<PgQueryResult, Error>;
}
