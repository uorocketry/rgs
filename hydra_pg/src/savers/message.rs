use libsql::{params, Connection};
use messages::{RadioData, RadioMessage};

use super::{common::save_common, sbg::save_sbg};

pub async fn save_message(db_connection: &Connection, data: RadioMessage<'_>) {
    let transaction = db_connection.transaction().await.unwrap();

    // Save the main RadioMessage
    let time_str = data.timestamp.0.to_string();
    let time_epoch = data.timestamp.0.and_utc().timestamp();
    let node_name = serde_json::to_string(&data.node)
        .unwrap()
        .trim_matches('"')
        .to_string();

    let message_id: u64 = transaction
        .execute(
            "INSERT INTO RadioMessage (timestamp, timestamp_epoch, node, data_type, data_id)
         VALUES (?, ?, ?, ?, ?)",
            params![
                time_str,   // Assuming data.timestamp is a chrono NaiveDateTime
                time_epoch, // UNIX epoch
                node_name,  // Assuming Node has a Display impl
                match &data.data {
                    RadioData::Common(_) => "Common",
                    RadioData::Sbg(_) => "Sbg",
                    RadioData::Gps(_) => "Gps",
                },
                0 // Placeholder for data_id
            ],
        )
        .await
        .unwrap();
    let radio_message_id = transaction.last_insert_rowid();

    // Handle RadioData types
    let data_id = match &data.data {
        RadioData::Common(common) => save_common(&transaction, common).await,
        RadioData::Sbg(sbg) => save_sbg(&transaction, sbg).await,
        RadioData::Gps(_) => unimplemented!(), // Skipping GPS for now
    };

    // Update the RadioMessage with the actual data_id
    transaction
        .execute(
            "UPDATE RadioMessage SET data_id = ? WHERE id = ?",
            params![data_id, radio_message_id],
        )
        .await
        .unwrap();

    // Commit the transaction
    transaction.commit().await.unwrap();
}
