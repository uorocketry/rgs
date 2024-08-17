use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::Imu1;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for Imu1 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let accelerometers = match self.accelerometers {
            Some(arr) => arr.iter().map(|&x| Some(x as f32)).collect(),
            None => vec![None, None, None],
        };
        let status_as_i32 = self
            .status
            .get_flags()
            .map(|status| status.bits() as i32)
            .unwrap_or(-1);

        let gyroscopes = match self.gyroscopes {
            Some(arr) => arr.iter().map(|&x| Some(x as f32)).collect(),
            None => vec![None, None, None],
        };

        query!(
            "INSERT INTO public.rocket_sensor_imu_1 (rocket_sensor_message_id,time_stamp,status,accelorometer_x,accelorometer_y,accelorometer_z,gyroscope_x,gyroscope_y,gyroscope_z)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            rocket_message_id,
            self.time_stamp as i32,
            status_as_i32,
            accelerometers[0],
            accelerometers[1],
            accelerometers[2],
            gyroscopes[0],
            gyroscopes[1],
            gyroscopes[2],
        )
        .execute(&mut **transaction)
        .await
    }
}
