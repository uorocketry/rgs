use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::sensor::Air;
use crate::database_service::hydra_input::saveable::SaveableData;

impl SaveableData for Air {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		query!(
			"INSERT INTO rocket_sensor_air
			(rocket_sensor_message_id, time_stamp, status, pressure_abs, altitude, pressure_diff, true_airspeed, air_temperature)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			rocket_message_id,
			self.time_stamp as i32,
			self.status as i32,
			self.pressure_abs as f32,
			self.altitude as f32,
			self.pressure_diff as f32,
			self.true_airspeed as f32,
			self.air_temperature as f32,
		)
		.execute(&mut **transaction)
		.await
	}
}