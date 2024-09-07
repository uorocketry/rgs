use crate::hydra_input::saveable::SaveableData;
use messages::sensor::EkfNav2;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfNav2 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let position = match self.position {
            Some(arr) => arr
                .iter()
                .map(|&x| Some(x as f32))
                .collect::<Vec<Option<f32>>>(),
            None => vec![None, None, None],
        };
        query!(
            "INSERT INTO public.rocket_sensor_ekf_nav_2 (rocket_sensor_message_id,position_x,position_y,position_z,undulation)
            VALUES ($1, $2, $3, $4, $5)",
            rocket_message_id,
            position[0],
            position[1],
            position[2],
            self.undulation,
        )
        .execute(&mut **transaction)
        .await
    }
}
