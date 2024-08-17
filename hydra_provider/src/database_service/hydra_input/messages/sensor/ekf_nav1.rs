use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::EkfNav1;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfNav1 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let velocity = match self.velocity {
            Some(velocity) => velocity.iter().map(|&x| Some(x)).collect(),
            None => vec![None, None, None],
        };

        query!(
            "INSERT INTO public.rocket_sensor_ekf_nav_1 (rocket_sensor_message_id,time_stamp,velocity_x,velocity_y,velocity_z)
            VALUES ($1, $2, $3, $4, $5)",        
            rocket_message_id,
            self.time_stamp as i32,
            velocity[0],
            velocity[1],
            velocity[2],
        )
        .execute(&mut **transaction)
        .await
    }
}
