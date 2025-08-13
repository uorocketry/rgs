use chrono::Utc;
use libsql::{params, Connection, Result, Transaction};
use messages_prost::{
    common::Node,
    radio::{self, RadioFrame},
    sensor::sbg::sbg_data,
};
use prost::Message as _;

use super::{
    barometer::save_barometer, command::save_command, imu::save_imu, log::save_log,
    madgwick::save_madgwick, sbg::save_sbg, state_msg::save_state,
};

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
            "INSERT INTO RadioFrame (timestamp, timestamp_epoch, node, data_type, data_id) VALUES (?, ?, ?, ?, ?)",
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
    tracing::info!(
        "Starting batch save for {} messages",
        message_bytes_list.len()
    );

    for message_bytes in message_bytes_list.iter() {
        match RadioFrame::decode_length_delimited(&message_bytes[..]) {
            Ok(frame) => {
                let node = frame.node;
                match frame.payload {
                    Some(radio::radio_frame::Payload::Barometer(m)) => {
                        let data_id = save_barometer(&transaction, &m).await?;
                        insert_radio_message(&transaction, node, "Barometer", data_id).await?;
                    }
                    Some(radio::radio_frame::Payload::Sbg(sbg)) => {
                        if let Some(inner) = &sbg.data {
                            let data_type = match inner {
                                sbg_data::Data::GpsPos(_) => "SbgGpsPos",
                                sbg_data::Data::UtcTime(_) => "SbgUtcTime",
                                sbg_data::Data::Imu(_) => "SbgImu",
                                sbg_data::Data::EkfQuat(_) => "SbgEkfQuat",
                                sbg_data::Data::EkfNav(_) => "SbgEkfNav",
                                sbg_data::Data::GpsVel(_) => "SbgGpsVel",
                                sbg_data::Data::Air(_) => "SbgAir",
                            };
                            let data_id = save_sbg(&transaction, &sbg).await?;
                            insert_radio_message(&transaction, node, data_type, data_id).await?;
                        }
                    }
                    // Intentionally ignored. Prefer SBG GpsPos/GpsVel.
                    // It's 8/11 and Phoenix still doesn't implement the new GPS message.
                    Some(radio::radio_frame::Payload::Gps(_)) => {
                        tracing::warn!(
                            "Generic GPS payload handler removed. Prefer SBG GpsPos/GpsVel."
                        );
                    }
                    Some(radio::radio_frame::Payload::Madgwick(m)) => {
                        let data_id = save_madgwick(&transaction, &m).await?;
                        insert_radio_message(&transaction, node, "Madgwick", data_id).await?;
                    }
                    Some(radio::radio_frame::Payload::Iim20670(m)) => {
                        let data_id = save_imu(&transaction, &m).await?;
                        insert_radio_message(&transaction, node, "Imu", data_id).await?;
                    }
                    Some(radio::radio_frame::Payload::Log(m)) => {
                        let data_id = save_log(&transaction, &m).await?;
                        insert_radio_message(&transaction, node, "Log", data_id).await?;
                    }
                    Some(radio::radio_frame::Payload::State(m)) => {
                        let data_id = save_state(&transaction, &m).await?;
                        insert_radio_message(&transaction, node, "State", data_id).await?;
                    }
                    Some(radio::radio_frame::Payload::Command(m)) => {
                        let data_id = save_command(&transaction, &m).await?;
                        insert_radio_message(&transaction, node, "Command", data_id).await?;
                    }
                    None => {
                        tracing::error!("RadioFrame had no payload. Skipping.");
                    }
                }
            }
            Err(_) => {
                tracing::error!("Failed to decode RadioFrame. Skipping buffer.");
            }
        }
    }

    tracing::info!("Committing batch save");
    transaction.commit().await?;
    Ok(())
}
