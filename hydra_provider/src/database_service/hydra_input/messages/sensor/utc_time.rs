use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::UtcTime;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

fn option_numeric_to_i32<T>(value: Option<T>) -> Option<i32> {
    match value {
        Some(val) => Some(val as i32),
        None => None,
    }
}

impl SaveableData for UtcTime {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
			"INSERT INTO rocket_sensor_utc_time
			(rocket_sensor_message_id, time_stamp, status, year, month, day, hour, minute, second, nano_second, gps_time_of_week)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			rocket_message_id,
			self.time_stamp as i32 ,
			0 , // FIXME: status
			option_numeric_to_i32(self.year) ,
			option_numeric_to_i32(self.month) ,
			option_numeric_to_i32(self.day) ,
			option_numeric_to_i32(self.hour) ,
			option_numeric_to_i32(self.minute) ,
			option_numeric_to_i32(self.second) ,
			option_numeric_to_i32(self.nano_second) ,
			option_numeric_to_i32(self.gps_time_of_week),
		)
		.execute(&mut **transaction)
		.await
    }
}
