use libsql::{params, Result, Transaction};
use messages_prost::sensor::gps::Gps;

pub async fn save_gps(transaction: &Transaction, gps: &Gps) -> Result<i64> {
    transaction
        .execute(
            "INSERT INTO Gps (message_type, data) VALUES (?, ?)",
            params![gps.message_type.as_str(), gps.data.as_slice()],
        )
        .await?;
    Ok(transaction.last_insert_rowid())
}
