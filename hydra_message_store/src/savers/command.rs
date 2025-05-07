use libsql::{params, Transaction};
use messages::{
    command::{Command, RadioRate},
    node::Node,
};

pub async fn save_command(transaction: &Transaction, command: &Command) -> i64 {
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
        .await
        .unwrap();
    let command_id = transaction.last_insert_rowid();

    // Save the specific Command subtype and get its ID
    let data_id: u64 = match command {
        Command::DeployDrogue(deploy) => transaction
            .execute(
                "INSERT INTO DeployDrogue (val) VALUES (?)",
                params![deploy.val],
            )
            .await
            .unwrap(),
        Command::DeployMain(deploy) => transaction
            .execute(
                "INSERT INTO DeployMain (val) VALUES (?)",
                params![deploy.val],
            )
            .await
            .unwrap(),
        Command::PowerDown(power_down) => transaction
            .execute(
                "INSERT INTO PowerDown (board) VALUES (?)",
                params![node_to_string(&power_down.board)],
            )
            .await
            .unwrap(),
        Command::RadioRateChange(rate_change) => transaction
            .execute(
                "INSERT INTO RadioRateChange (rate) VALUES (?)",
                params![radio_rate_to_string(&rate_change.rate)],
            )
            .await
            .unwrap(),
        Command::Online(online) => transaction
            .execute(
                "INSERT INTO Online (online) VALUES (?)",
                params![online.online],
            )
            .await
            .unwrap(),
    };

    // Update Command with the actual data_id
    transaction
        .execute(
            "UPDATE Command SET data_id = ? WHERE id = ?",
            params![data_id, command_id],
        )
        .await
        .unwrap();

    command_id
}

fn node_to_string(node: &Node) -> String {
    serde_json::to_string(node)
        .unwrap()
        .trim_matches('"')
        .to_string()
}

fn radio_rate_to_string(rate: &RadioRate) -> String {
    serde_json::to_string(rate)
        .unwrap()
        .trim_matches('"')
        .to_string()
}
