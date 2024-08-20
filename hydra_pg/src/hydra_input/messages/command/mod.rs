pub mod deploy_drogue;
pub mod deploy_main;
pub mod power_down;
pub mod radio_rate_change;
use crate::hydra_input::saveable::SaveableData;
use messages::command::{Command, CommandData};
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for Command {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let result = query!(
            "INSERT INTO rocket_command
				(rocket_message_id)
				VALUES ($1)",
            rocket_message_id,
        )
        .execute(&mut **transaction)
        .await;

        if result.is_err() {
            return result;
        }

        match &self.data {
            CommandData::DeployDrogue(data) => data.save(transaction, rocket_message_id).await,
            CommandData::DeployMain(data) => data.save(transaction, rocket_message_id).await,
            CommandData::RadioRateChange(data) => data.save(transaction, rocket_message_id).await,
            CommandData::PowerDown(data) => data.save(transaction, rocket_message_id).await,
            CommandData::Online(_) => todo!(),
        }
    }
}
