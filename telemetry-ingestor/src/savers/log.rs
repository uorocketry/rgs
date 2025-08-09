use libsql::{params, Result, Transaction};
use messages_prost::log::Log;

pub async fn save_log(transaction: &Transaction, log_msg: &Log) -> Result<i64> {
    transaction
        .execute(
            "INSERT INTO ProtoLog (message) VALUES (?)",
            params![log_msg.message.as_slice()],
        )
        .await?;
    Ok(transaction.last_insert_rowid())
}
