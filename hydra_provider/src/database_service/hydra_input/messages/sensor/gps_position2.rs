use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsPos2;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for GpsPos2 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
			"INSERT INTO rocket_sensor_gps_pos_2
			(rocket_sensor_message_id, latitude_accuracy, longitude_accuracy, altitude_accuracy, num_sv_used, base_station_id, differential_age)
			VALUES ($1, $2, $3, $4, $5, $6, $7)",
			rocket_message_id,
			self.latitude_accuracy as f32,
			self.longitude_accuracy as f32,
			self.altitude_accuracy as f32,
			self.num_sv_used as i32,
			self.base_station_id as i32,
			self.differential_age as i32,
		)
		.execute(&mut **transaction)
		.await
    }
}
