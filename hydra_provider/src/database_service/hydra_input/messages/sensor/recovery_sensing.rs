use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::RecoverySensing;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for RecoverySensing {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_recovery_sensing (
                rocket_sensor_message_id,
                drogue_current,
                main_current,
                drogue_voltage,
                main_voltage
            ) VALUES ($1, $2, $3, $4, $5)",
            rocket_message_id,
            self.drogue_current as i32,
            self.main_current as i32,
            self.drogue_voltage as i32,
            self.main_voltage as i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
