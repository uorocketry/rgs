use messages::command::{self, Command, CommandData};

use sqlx::{postgres::PgQueryResult, Postgres, Transaction};

pub async fn add_rocket_command(
    cmd: Command,
    rocket_message_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let cmd_data = cmd.data;
    let res = sqlx::query!(
        "INSERT INTO rocket_command
                        (rocket_message_id)
                        VALUES ($1)",
        rocket_message_id
    )
    .execute(&mut **transaction)
    .await;

    if res.is_err() {
        return Err(res.err().unwrap());
    }

    match cmd_data {
        CommandData::DeployDrogue(deploy_drogue) => {
            return add_deploy_drogue_command(deploy_drogue, rocket_message_id, transaction).await;
        }
        CommandData::DeployMain(deploy_main) => {
            return add_deploy_main_command(deploy_main, rocket_message_id, transaction).await;
        }
        CommandData::PowerDown(power_down) => {
            return add_power_down_command(power_down, rocket_message_id, transaction).await;
        }
        CommandData::RadioRateChange(radio_rate_change) => {
            return add_radio_rate_change_command(
                radio_rate_change,
                rocket_message_id,
                transaction,
            )
            .await;
        }
    }
}

async fn add_deploy_drogue_command(
    deploy_drogue: command::DeployDrogue,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_deploy_drogue_command
                        (rocket_command_id, val)
                        VALUES ($1, $2)",
        rocket_command_id,
        deploy_drogue.val
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_deploy_main_command(
    deploy_main: command::DeployMain,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_deploy_main_command
                        (rocket_command_id, val)
                        VALUES ($1, $2)",
        rocket_command_id,
        deploy_main.val
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_power_down_command(
    power_down: command::PowerDown,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_power_down_command
                        (rocket_command_id, board)
                        VALUES ($1, $2)",
        rocket_command_id,
        format!("{:?}", power_down.board)
    )
    .execute(&mut **transaction)
    .await;
}

async fn add_radio_rate_change_command(
    radio_rate_change: command::RadioRateChange,
    rocket_command_id: i32,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_radio_rate_change_command
                        (rocket_command_id, rate)
                        VALUES ($1, $2)",
        rocket_command_id,
        format!("{:?}", radio_rate_change.rate)
    )
    .execute(&mut **transaction)
    .await;
}
