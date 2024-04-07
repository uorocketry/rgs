use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::EkfQuat;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for EkfQuat {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_quat (rocket_sensor_message_id, time_stamp, quat_w, quat_x, quat_y, quat_z, euler_std_dev_x, euler_std_dev_y, euler_std_dev_z, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            rocket_message_id,
            self.time_stamp as i32,
            self.quaternion[0],
            self.quaternion[1],
            self.quaternion[2],
            self.quaternion[3],
            self.euler_std_dev[0],
            self.euler_std_dev[1],
            self.euler_std_dev[2],
            self.status as i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
