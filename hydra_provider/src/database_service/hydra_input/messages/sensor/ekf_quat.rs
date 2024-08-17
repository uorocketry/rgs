use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::EkfQuat;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfQuat {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let quaternion = match self.quaternion {
            Some(arr) => arr.iter().map(|&x| Some(x)).collect::<Vec<Option<f32>>>(),
            None => vec![None, None, None, None],
        };
        let euler_std_dev = match self.euler_std_dev {
            Some(arr) => arr.iter().map(|&x| Some(x)).collect::<Vec<Option<f32>>>(),
            None => vec![None, None, None],
        };
        let status_as_i32 = self
            .status
            .get_solution_mode()
            .map(|status| status as i32)
            .unwrap_or(-1);
        query!(
            "INSERT INTO public.rocket_sensor_quat (rocket_sensor_message_id, time_stamp, quat_w, quat_x, quat_y, quat_z, euler_std_dev_x, euler_std_dev_y, euler_std_dev_z, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            rocket_message_id,
            self.time_stamp as i32,
            quaternion[0],
            quaternion[1],
            quaternion[2],
            quaternion[3],
            euler_std_dev[0],
            euler_std_dev[1],
            euler_std_dev[2],
            status_as_i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
