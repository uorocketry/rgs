use crate::hydra_input::saveable::SaveableData;
use messages::sensor::Air;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for Air {
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

        query!(
			"INSERT INTO rocket_sensor_air
			(rocket_sensor_message_id, time_stamp, status, pressure_abs, altitude, pressure_diff, true_airspeed, air_temperature)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			rocket_message_id,
			self.time_stamp as i32,
			status_as_i32,
			self.pressure_abs,
			self.altitude,
			self.pressure_diff ,
			self.true_airspeed,
			self.air_temperature,
		)
		.execute(&mut **transaction)
		.await
    }
}
