use super::utils::store_3d_vector;
use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::EkfNav2;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfNav2 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let position = store_3d_vector(self.position.map(|x| x as f32), transaction).await?;
        let position_std_dev = store_3d_vector(self.position_std_dev, transaction).await?;

        query!(
            "INSERT INTO rocket_sensor_nav_2
			(rocket_sensor_message_id, position, position_std_dev, undulation, status)
			VALUES ($1, $2, $3, $4, $5)",
            rocket_message_id,
            position,
            position_std_dev,
            self.undulation,
            self.status as i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
