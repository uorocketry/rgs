use libsql::{params, Result, Transaction};
use messages_prost::state::State;

pub async fn save_state(transaction: &Transaction, state: &State) -> Result<i64> {
    let state_str = format!("{:?}", state);
    transaction
        .execute("INSERT INTO State (state) VALUES (?)", params![state_str])
        .await?;
    Ok(transaction.last_insert_rowid())
}
