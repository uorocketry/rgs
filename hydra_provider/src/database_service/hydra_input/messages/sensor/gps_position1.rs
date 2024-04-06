use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsPos1;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for GpsPos1 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
			"INSERT INTO rocket_sensor_gps_pos_1
			(rocket_sensor_message_id, time_stamp, status, time_of_week, latitude, longitude, altitude, undulation)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			rocket_message_id,
			self.time_stamp as i32,
			self.status as i32,
			self.time_of_week as i32,
			self.latitude as f32,
			self.longitude as f32,
			self.altitude as f32,
			self.undulation as f32,
		)
		.execute(&mut **transaction)
		.await
    }
}
