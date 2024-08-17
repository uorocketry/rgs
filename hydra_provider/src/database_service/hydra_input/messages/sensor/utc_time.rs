use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::UtcTime;
use serde::de::value;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

fn option_numeric_to_i32<T: Into<i32>>(value: Option<T>) -> Option<i32> {
    match value {
        Some(value) => Some(value.into()),
        None => None,
    }
}

impl SaveableData for UtcTime {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let status_as_i32 = self
            .status
            .get_clock_status()
            .map(|status| status as i32)
            .unwrap_or(-1);

        let gps_time_of_week = match self.gps_time_of_week {
            Some(gps_time_of_week) => Some(gps_time_of_week as i32),
            None => None,
        };
        query!(
			"INSERT INTO rocket_sensor_utc_time
			(rocket_sensor_message_id, time_stamp, status, year, month, day, hour, minute, second, nano_second, gps_time_of_week)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			rocket_message_id,
			self.time_stamp as i32 ,
			status_as_i32,
			option_numeric_to_i32(self.year) ,
			option_numeric_to_i32(self.month) ,
			option_numeric_to_i32(self.day) ,
			option_numeric_to_i32(self.hour) ,
			option_numeric_to_i32(self.minute) ,
			option_numeric_to_i32(self.second) ,
			option_numeric_to_i32(self.nano_second) ,
			gps_time_of_week,
		)
		.execute(&mut **transaction)
		.await
    }
}
