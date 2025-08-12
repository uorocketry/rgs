use libsql::{params, Result, Transaction};
use messages_prost::log::Log;

pub async fn save_log(transaction: &Transaction, log_msg: &Log) -> Result<i64> {
    let level = format!("{:?}", log_msg.level);
    let event = format!("{:?}", log_msg.event);
    transaction
        .execute(
            "INSERT INTO Log (level, event) VALUES (?, ?)",
            params![level, event],
        )
        .await?;
    Ok(transaction.last_insert_rowid())
}
