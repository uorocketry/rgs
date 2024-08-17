use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::Imu2;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for Imu2 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let delta_velocity = match self.delta_velocity {
            Some(velocity) => velocity
                .iter()
                .map(|&x| Some(x))
                .collect::<Vec<Option<f32>>>(),
            None => vec![None, None, None],
        };

        let delta_angle = match self.delta_angle {
            Some(angle) => angle.iter().map(|&x| Some(x)).collect::<Vec<Option<f32>>>(),
            None => vec![None, None, None],
        };

        query!(
            "INSERT INTO public.rocket_sensor_imu_2 (rocket_sensor_message_id,temperature,delta_velocity_x,delta_velocity_y,delta_velocity_z,delta_angle_x,delta_angle_y,delta_angle_z)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            rocket_message_id,
            self.temperature,
            delta_velocity[0],
            delta_velocity[1],
            delta_velocity[2],
            delta_angle[0],
            delta_angle[1],
            delta_angle[2],
        )
        .execute(&mut **transaction)
        .await
    }
}
