use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsVelAcc;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};


impl SaveableData for GpsVelAcc {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let status_as_i32 = self
            .status
            .get_status()
            .map(|status| status as i32)
            .unwrap_or(-1);

        let num_sv_used = match self.num_sv_used {
            Some(num_sv_used) => Some(num_sv_used as i32),
            None => None,
        };

        let base_station_id = match self.base_station_id {
            Some(base_station_id) => Some(base_station_id as i32),
            None => None,
        };

        let differential_age = match self.differential_age {
            Some(differential_age) => Some(differential_age as i32),
            None => None,
        };

        query!(
            "INSERT INTO public.rocket_sensor_gps_pos_acc (rocket_sensor_message_id, time_stamp, status, latitude_accuracy, longitude_accuracy, altitude_accuracy, num_sv_used, base_station_id, differential_age)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            rocket_message_id,
            self.time_stamp as i32,
            status_as_i32,
            self.latitude_accuracy,
            self.longitude_accuracy,
            self.altitude_accuracy,
            num_sv_used,
            base_station_id,
            differential_age,
        )
        .execute(&mut **transaction)
        .await
    }
}
