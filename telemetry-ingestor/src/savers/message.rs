use libsql::{params, Connection, Result, Transaction};
use messages_prost::sbg::SbgMessage;
use prost::Message as _;
use chrono::Utc;

// use super::{common::save_common, sbg::save_sbg};

// Helper function to save a single message within an existing transaction
async fn save_single_message_in_transaction(
    transaction: &Transaction,
    data: &SbgMessage,
) -> Result<i64> {
    // Placeholder timestamp handling until protobuf schema finalized
    let time_str = Utc::now().to_rfc3339();
    let time_epoch = Utc::now().timestamp();
    let node_name = format!("{:?}", data.node);

    transaction
        .execute(
            "INSERT INTO RadioMessage (timestamp, timestamp_epoch, node, data_type, data_id)
         VALUES (?, ?, ?, ?, ?)",
            params![
                time_str,
                time_epoch,
                node_name,
                "Sbg",
                0 // Placeholder for data_id
            ],
        )
        .await?;
    let radio_message_id = transaction.last_insert_rowid();

    // Handle RadioData types
    let data_id = 0;

    // Update the RadioMessage with the actual data_id
    transaction
        .execute(
            "UPDATE RadioMessage SET data_id = ? WHERE id = ?",
            params![data_id, radio_message_id],
        )
        .await?;

    Ok(radio_message_id)
}

pub async fn save_messages_batch(
    db_connection: &Connection,
    message_bytes_list: Vec<Vec<u8>>,
) -> Result<()> {
    if message_bytes_list.is_empty() {
        return Ok(());
    }

    let transaction = db_connection.transaction().await?;
    tracing::info!(
        "Starting batch save for {} messages",
        message_bytes_list.len()
    );

    for message_bytes in message_bytes_list.iter() {
        match SbgMessage::decode(&message_bytes[..]) {
            Ok(message) => {
                if let Err(e) = save_single_message_in_transaction(&transaction, &message).await {
                    tracing::error!(
                        "Error saving decoded message in batch: {:?}. Rolling back.",
                        e
                    );
                    transaction.rollback().await?;
                    return Err(e);
                }
            }
            Err(e) => {
                tracing::error!("Failed to decode protobuf message in batch: {:?}. Skipping.", e);
            }
        }
    }

    tracing::info!("Committing batch save");
    transaction.commit().await?;
    Ok(())
}
