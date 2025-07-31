use libsql::{params, Result, Transaction};
use messages_prost::state::{StateMessage, State};

pub async fn save_state(transaction: &Transaction, state_msg: &StateMessage) -> Result<i64> {
    let state_str = State::try_from(state_msg.state)
        .map(|s| format!("{:?}", s))
        .unwrap_or_else(|_| "UNKNOWN".to_string());
    transaction
        .execute(
            "INSERT INTO StateMessage (state) VALUES (?)",
            params![state_str],
        )
        .await?;
    Ok(transaction.last_insert_rowid())
}
