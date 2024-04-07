use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::EkfNav1;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfNav1 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_nav_1 (rocket_sensor_message_id,time_stamp,velocity_x,velocity_y,velocity_z,velocity_std_dev_x,velocity_std_dev_y,velocity_std_dev_z)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",        
            rocket_message_id,
            self.time_stamp as i32,
            self.velocity[0],
            self.velocity[1],
            self.velocity[2],
            self.velocity_std_dev[0],
            self.velocity_std_dev[1],
            self.velocity_std_dev[2],
        )
        .execute(&mut **transaction)
        .await
    }
}
