use libsql::{params, Connection, Result, Transaction};
use messages::{RadioData, RadioMessage};
use postcard::from_bytes;

use super::{common::save_common, sbg::save_sbg};

// Helper function to save a single message within an existing transaction
async fn save_single_message_in_transaction(
    transaction: &Transaction,
    data: &RadioMessage<'_>,
) -> Result<i64> {
    // Save the main RadioMessage
    let time_str = data.timestamp.0.to_string();
    let time_epoch = data.timestamp.0.and_utc().timestamp();
    let node_name = serde_json::to_string(&data.node)
        .unwrap() // Consider handling this error
        .trim_matches('"')
        .to_string();

    transaction
        .execute(
            "INSERT INTO RadioMessage (timestamp, timestamp_epoch, node, data_type, data_id)
         VALUES (?, ?, ?, ?, ?)",
            params![
                time_str,
                time_epoch,
                node_name,
                match &data.data {
                    RadioData::Common(_) => "Common",
                    RadioData::Sbg(_) => "Sbg",
                    RadioData::Gps(_) => "Gps",
                },
                0 // Placeholder for data_id
            ],
        )
        .await?;
    let radio_message_id = transaction.last_insert_rowid();

    // Handle RadioData types
    let data_id = match &data.data {
        RadioData::Common(common) => save_common(transaction, common).await, // Assuming this returns Result<i64> or can be adapted
        RadioData::Sbg(sbg) => save_sbg(transaction, sbg).await, // Assuming this returns Result<i64> or can be adapted
        RadioData::Gps(_) => unimplemented!(),                   // Skipping GPS for now
    };

    // Update the RadioMessage with the actual data_id
    transaction
        .execute(
            "UPDATE RadioMessage SET data_id = ? WHERE id = ?",
            params![data_id, radio_message_id],
        )
        .await?;

    Ok(radio_message_id)
}

pub async fn save_message(db_connection: &Connection, data: RadioMessage<'_>) {
    let transaction = match db_connection.transaction().await {
        Ok(tx) => tx,
        Err(e) => {
            tracing::error!("Failed to begin transaction: {:?}", e);
            return;
        }
    };

    match save_single_message_in_transaction(&transaction, &data).await {
        Ok(_) => {
            if let Err(e) = transaction.commit().await {
                tracing::error!("Failed to commit transaction: {:?}", e);
            }
        }
        Err(e) => {
            tracing::error!("Failed to save message in transaction: {:?}", e);
            // Attempt to rollback, ignoring potential error
            let _ = transaction.rollback().await;
        }
    }
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
        match from_bytes::<RadioMessage<'_>>(message_bytes) {
            Ok(message) => {
                if let Err(e) = save_single_message_in_transaction(&transaction, &message).await {
                    tracing::error!(
                        "Error saving deserialized message in batch: {:?}. Rolling back.",
                        e
                    );
                    transaction.rollback().await?;
                    return Err(e); // Propagate the error
                }
            }
            Err(e) => {
                tracing::error!("Failed to deserialize message in batch: {:?}. Skipping.", e);
            }
        }
    }

    tracing::info!("Committing batch save");
    transaction.commit().await?;
    Ok(())
}
