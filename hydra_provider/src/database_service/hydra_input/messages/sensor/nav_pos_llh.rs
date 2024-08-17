use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::NavPosLlh;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for NavPosLlh {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_nav_pos_llh (
                rocket_sensor_message_id,
                height_msl,
                longitude,
                latitude
            ) VALUES ($1, $2, $3, $4)",
            rocket_message_id,
            self.height_msl,
            self.longitude,
            self.latitude,
        )
        .execute(&mut **transaction)
        .await
    }
}
