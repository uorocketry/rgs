use libsql::{params, Result, Transaction};
use messages::{
    command::{Command, RadioRate},
    node::Node,
};

fn node_to_string(node: &Node) -> Result<String> {
    Ok(serde_json::to_string(node)
        .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
        .trim_matches('"')
        .to_string())
}

fn radio_rate_to_string(rate: &RadioRate) -> Result<String> {
    Ok(serde_json::to_string(rate)
        .map_err(|e| libsql::Error::ToSqlConversionFailure(Box::new(e)))?
        .trim_matches('"')
        .to_string())
}

pub async fn save_command(transaction: &Transaction, command: &Command) -> Result<i64> {
    let data_type = match command {
        Command::DeployDrogue(_) => "DeployDrogue",
        Command::DeployMain(_) => "DeployMain",
        Command::PowerDown(_) => "PowerDown",
        Command::RadioRateChange(_) => "RadioRateChange",
        Command::Online(_) => "Online",
    };

    transaction
        .execute(
            "INSERT INTO Command (data_type, data_id) VALUES (?, ?)",
            params![data_type, 0], // Placeholder for data_id
        )
        .await?;
    let command_id = transaction.last_insert_rowid();

    // Save the specific Command subtype and get its ID
    let data_id: i64 = match command {
        Command::DeployDrogue(deploy) => {
            transaction
                .execute(
                    "INSERT INTO DeployDrogue (val) VALUES (?)",
                    params![deploy.val],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        Command::DeployMain(deploy) => {
            transaction
                .execute(
                    "INSERT INTO DeployMain (val) VALUES (?)",
                    params![deploy.val],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        Command::PowerDown(power_down) => {
            transaction
                .execute(
                    "INSERT INTO PowerDown (board) VALUES (?)",
                    params![node_to_string(&power_down.board)?],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        Command::RadioRateChange(rate_change) => {
            transaction
                .execute(
                    "INSERT INTO RadioRateChange (rate) VALUES (?)",
                    params![radio_rate_to_string(&rate_change.rate)?],
                )
                .await?;
            transaction.last_insert_rowid()
        }
        Command::Online(online) => {
            transaction
                .execute(
                    "INSERT INTO Online (online) VALUES (?)",
                    params![online.online],
                )
                .await?;
            transaction.last_insert_rowid()
        }
    };

    // Update Command with the actual data_id
    transaction
        .execute(
            "UPDATE Command SET data_id = ? WHERE id = ?",
            params![data_id, command_id],
        )
        .await?;

    Ok(command_id)
}
