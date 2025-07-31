use chrono::Utc;
use libsql::{params, Connection, Result, Transaction};
use messages_prost::{
    common::Node,
    log::Log,
    sensor::{gps::Gps, iim20670::Imu, madgwick::Madgwick, sbg::SbgMessage},
    state::StateMessage,
};
use prost::Message as _;

// use super::{common::save_common, sbg::save_sbg};

// Helper function to save a single protobuf message within a transaction
async fn save_single_message_in_transaction(
    transaction: &Transaction,
    node: i32,
    data_type: &str,
    bytes: &[u8],
) -> Result<i64> {
    let time_str = Utc::now().to_rfc3339();
    let time_epoch = Utc::now().timestamp();
    let node_name = Node::try_from(node)
        .map(|n| format!("{:?}", n))
        .unwrap_or_else(|_| "Unspecified".to_string());

    // store raw bytes first
    transaction
        .execute("INSERT INTO ProtoPayload (bytes) VALUES (?)", params![bytes])
        .await?;
    let payload_id = transaction.last_insert_rowid();

    // store radio message referencing payload
    transaction
        .execute(
            "INSERT INTO RadioMessage (timestamp, timestamp_epoch, node, data_type, data_id)
             VALUES (?, ?, ?, ?, ?)",
            params![time_str, time_epoch, node_name, data_type, payload_id],
        )
        .await?;

    Ok(transaction.last_insert_rowid())
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
            if let Err(e) = save_single_message_in_transaction(&transaction, msg.node, "Sbg", message_bytes).await
            {
                tracing::error!(
                    "Error saving decoded SbgMessage in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else if let Ok(msg) = Gps::decode(&message_bytes[..]) {
            if let Err(e) = save_single_message_in_transaction(&transaction, msg.node, "Gps", message_bytes).await
            {
                tracing::error!(
                    "Error saving decoded Gps message in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else if let Ok(msg) = Imu::decode(&message_bytes[..]) {
            if let Err(e) = save_single_message_in_transaction(&transaction, msg.node, "Imu", message_bytes).await
            {
                tracing::error!(
                    "Error saving decoded Imu message in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else if let Ok(msg) = Madgwick::decode(&message_bytes[..]) {
            if let Err(e) =
                save_single_message_in_transaction(&transaction, msg.node, "Madgwick", message_bytes).await
            {
                tracing::error!(
                    "Error saving decoded Madgwick message in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else if let Ok(msg) = Log::decode(&message_bytes[..]) {
            if let Err(e) = save_single_message_in_transaction(&transaction, msg.node, "Log", message_bytes).await
            {
                tracing::error!(
                    "Error saving decoded Log message in batch: {:?}. Rolling back.",
                    e
                );
                transaction.rollback().await?;
                return Err(e);
            }
        } else if let Ok(msg) = StateMessage::decode(&message_bytes[..]) {
            if let Err(e) =
                save_single_message_in_transaction(&transaction, msg.node, "State", message_bytes).await
            {
                tracing::error!(
                    "Error saving decoded State message in batch: {:?}. Rolling back.",
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
