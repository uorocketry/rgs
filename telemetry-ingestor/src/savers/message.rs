use chrono::Utc;
use libsql::{params, Connection, Result, Transaction};
use messages_prost::{
    common::Node,
    log::Log,
    sensor::{gps::Gps, iim20670::Imu, madgwick::Madgwick, sbg::{SbgMessage, sbg_data}},
    state::StateMessage,
};
use prost::Message as _;

use super::{gps::save_gps, imu::save_imu, madgwick::save_madgwick, log::save_log, sbg::save_sbg, state_msg::save_state};

async fn insert_radio_message(
    transaction: &Transaction,
    node: i32,
    data_type: &str,
    data_id: i64,
) -> Result<i64> {
    let time_str = Utc::now().to_rfc3339();
    let time_epoch = Utc::now().timestamp();
    let node_name = Node::try_from(node)
        .map(|n| format!("{:?}", n))
        .unwrap_or_else(|_| "Unspecified".to_string());

    transaction
        .execute(
            "INSERT INTO RadioMessage (timestamp, timestamp_epoch, node, data_type, data_id) VALUES (?, ?, ?, ?, ?)",
            params![time_str, time_epoch, node_name, data_type, data_id],
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
    tracing::info!("Starting batch save for {} messages", message_bytes_list.len());

    for message_bytes in message_bytes_list.iter() {
        if let Ok(msg) = SbgMessage::decode(&message_bytes[..]) {
            if let Some(data) = &msg.data {
                let (data_type, data_id) = match data.data.as_ref().unwrap() {
                    sbg_data::Data::GpsPos(_) => ("SbgGpsPos", save_sbg(&transaction, data).await?),
                    sbg_data::Data::UtcTime(_) => ("SbgUtcTime", save_sbg(&transaction, data).await?),
                    sbg_data::Data::Imu(_) => ("SbgImu", save_sbg(&transaction, data).await?),
                    sbg_data::Data::EkfQuat(_) => ("SbgEkfQuat", save_sbg(&transaction, data).await?),
                    sbg_data::Data::EkfNav(_) => ("SbgEkfNav", save_sbg(&transaction, data).await?),
                    sbg_data::Data::GpsVel(_) => ("SbgGpsVel", save_sbg(&transaction, data).await?),
                    sbg_data::Data::Air(_) => ("SbgAir", save_sbg(&transaction, data).await?),
                };
                insert_radio_message(&transaction, msg.node, data_type, data_id).await?;
            }
        } else if let Ok(msg) = Gps::decode(&message_bytes[..]) {
            let data_id = save_gps(&transaction, &msg).await?;
            insert_radio_message(&transaction, msg.node, "Gps", data_id).await?;
        } else if let Ok(msg) = Imu::decode(&message_bytes[..]) {
            let data_id = save_imu(&transaction, &msg).await?;
            insert_radio_message(&transaction, msg.node, "Imu", data_id).await?;
        } else if let Ok(msg) = Madgwick::decode(&message_bytes[..]) {
            let data_id = save_madgwick(&transaction, &msg).await?;
            insert_radio_message(&transaction, msg.node, "Madgwick", data_id).await?;
        } else if let Ok(msg) = Log::decode(&message_bytes[..]) {
            let data_id = save_log(&transaction, &msg).await?;
            insert_radio_message(&transaction, msg.node, "Log", data_id).await?;
        } else if let Ok(msg) = StateMessage::decode(&message_bytes[..]) {
            let data_id = save_state(&transaction, &msg).await?;
            insert_radio_message(&transaction, msg.node, "State", data_id).await?;
        } else {
            tracing::error!("Failed to decode protobuf message in batch. Skipping.");
        }
    }

    tracing::info!("Committing batch save");
    transaction.commit().await?;
    Ok(())
}
