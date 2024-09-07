use crate::hydra_input::saveable::SaveableData;
use messages::sensor::EkfNavAcc;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfNavAcc {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let status_as_i32 = self
            .status
            .get_flags()
            .map(|status| status.bits() as i32)
            .unwrap_or(-1);

        let velocty_std_dev = match self.velocity_std_dev {
            Some(arr) => arr.iter().map(|&x| Some(x as f32)).collect(),
            None => vec![None, None, None],
        };

        let position_std_dev = match self.position_std_dev {
            Some(arr) => arr.iter().map(|&x| Some(x as f32)).collect(),
            None => vec![None, None, None],
        };
        query!(
            "INSERT INTO public.rocket_sensor_ekf_nav_acc (
                rocket_sensor_message_id,
                status,
                velocity_std_dev_x,
                velocity_std_dev_y,
                velocity_std_dev_z,
                position_std_dev_x,
                position_std_dev_y,
                position_std_dev_z
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            rocket_message_id,
            status_as_i32,
            velocty_std_dev[0],
            velocty_std_dev[1],
            velocty_std_dev[2],
            position_std_dev[0],
            position_std_dev[1],
            position_std_dev[2],
        )
        .execute(&mut **transaction)
        .await
    }
}
