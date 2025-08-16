use libsql::{params, Result, Transaction};
use messages_prost::state::State;

pub async fn save_state(transaction: &Transaction, state_value: i32) -> Result<i64> {
    let state_str = State::try_from(state_value)
        .map(|s| format!("{:?}", s))
        .unwrap_or_else(|_| "UNKNOWN".to_string());
    transaction
        .execute(
            "INSERT INTO State (state) VALUES (?)",
            params![state_str],
        )
        .await?;
    Ok(transaction.last_insert_rowid())
}


