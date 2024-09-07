use messages::sensor::GpsVelAcc;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};
use crate::hydra_input::saveable::SaveableData;



impl SaveableData for GpsVelAcc {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let velocity_acc = match self.velocity_acc {
            Some(arr) => arr.iter().map(|&x| Some(x as f32)).collect::<Vec<Option<f32>>>(),
            None => vec![None, None, None],
        };

        query!(
            "INSERT INTO public.rocket_sensor_gps_vel_acc (rocket_sensor_message_id, course_acc, velocity_acc_x, velocity_acc_y, velocity_acc_z)
            VALUES ($1, $2, $3, $4, $5)",
            rocket_message_id,
            self.course_acc,
            velocity_acc[0],
            velocity_acc[1],
            velocity_acc[2], 
        )
        .execute(&mut **transaction)
        .await
    }
}
