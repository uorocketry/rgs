use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::EkfNav2;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfNav2 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_nav_2 (rocket_sensor_message_id,position_x,position_y,position_z,position_std_dev_x,position_std_dev_y,position_std_dev_z,undulation,status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            rocket_message_id,
            self.position[0] as f32,
            self.position[1] as f32,
            self.position[2] as f32,
            self.position_std_dev[0],
            self.position_std_dev[1],
            self.position_std_dev[2],
            self.undulation,
            self.status as i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
