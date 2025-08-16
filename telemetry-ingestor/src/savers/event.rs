use libsql::{params, Result, Transaction};
use messages_prost::state::Event;

pub async fn save_event(transaction: &Transaction, event_value: i32) -> Result<i64> {
    let event_str = Event::try_from(event_value)
        .map(|e| format!("{:?}", e))
        .unwrap_or_else(|_| "UNKNOWN".to_string());
    transaction
        .execute("INSERT INTO Event (event) VALUES (?)", params![event_str])
        .await?;
    Ok(transaction.last_insert_rowid())
}
