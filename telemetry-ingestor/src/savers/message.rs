use libsql::{params, Connection, Result, Transaction};
use messages_prost::{
    common::Node,
    sensor::{gps::Gps, sbg::SbgMessage},
};
use prost::Message as _;
use chrono::Utc;

// use super::{common::save_common, sbg::save_sbg};

// Helper function to save a single message within an existing transaction
async fn save_single_message_in_transaction(
    transaction: &Transaction,
    node: i32,
    data_type: &str,
) -> Result<i64> {
    // Placeholder timestamp handling until protobuf schema finalized
    let time_str = Utc::now().to_rfc3339();
    let time_epoch = Utc::now().timestamp();
    let node_name = Node::try_from(node)
        .map(|n| format!("{:?}", n))
        .unwrap_or_else(|_| "Unspecified".to_string());

    transaction
        .execute(
            "INSERT INTO RadioMessage (timestamp, timestamp_epoch, node, data_type, data_id)
         VALUES (?, ?, ?, ?, ?)",
            params![
                time_str,
                time_epoch,
                node_name,
                data_type,
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
        if let Ok(msg) = SbgMessage::decode(&message_bytes[..]) {
            if let Err(e) = save_single_message_in_transaction(&transaction, msg.node, "Sbg").await {
                tracing::error!(
                    "Error saving decoded SbgMessage in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else if let Ok(msg) = Gps::decode(&message_bytes[..]) {
            if let Err(e) = save_single_message_in_transaction(&transaction, msg.node, "Gps").await {
                tracing::error!(
                    "Error saving decoded Gps message in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else {
            tracing::error!("Failed to decode protobuf message in batch. Skipping.");
        }
    }

    tracing::info!("Committing batch save");
    transaction.commit().await?;
    Ok(())
}
