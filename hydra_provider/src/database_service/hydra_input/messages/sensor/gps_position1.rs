use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsPos1;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for GpsPos1 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO rocket_sensor_gps_pos_1
			(rocket_sensor_message_id, latitude, longitude)
			VALUES ($1, $2, $3)",
            rocket_message_id,
            self.latitude,
            self.longitude,
        )
        .execute(&mut **transaction)
        .await
    }
}
