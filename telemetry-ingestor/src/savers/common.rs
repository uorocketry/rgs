use libsql::{params, Result, Transaction};
use messages::Common;

use super::command::save_command;

pub async fn save_common(transaction: &Transaction, common: &Common) -> Result<i64> {
    let data_type = match common {
        Common::ResetReason(_) => "ResetReason",
        Common::Command(_) => "Command",
        Common::Log(_) => "Log",
        Common::State(_) => "State",
    };

    // Save the Common data
    transaction
        .execute(
            "INSERT INTO Common (data_type, data_id) VALUES (?, ?)",
            params![data_type, 0], // Placeholder for data_id
        )
        .await?;
    let common_row_id = transaction.last_insert_rowid();

    // Save the specific subtype
    let data_id: i64 = match common {
        Common::ResetReason(reason) => {
            transaction
                .execute(
                    "INSERT INTO ResetReason (reset_reason) VALUES (?)",
                    params![reason.to_string()],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        Common::Command(command) => save_command(transaction, command).await?,
        Common::Log(log) => {
            let level = serde_json::to_string(&log.level)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();

            transaction
                .execute(
                    "INSERT INTO Log (level, event) VALUES (?, ?)",
                    params![level, log.event.to_string()],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        Common::State(state) => {
            let state_str = serde_json::to_string(&state)
                .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
                .trim_matches('"')
                .to_string();

            transaction
                .execute("INSERT INTO State (state) VALUES (?)", params![state_str])
                .await?;
            transaction.last_insert_rowid()
        }
    };

    // Update Common with the actual data_id
    transaction
        .execute(
            "UPDATE Common SET data_id = ? WHERE id = ?",
            params![data_id, common_row_id],
        )
        .await?;

    Ok(common_row_id)
}
