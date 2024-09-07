use messages::sensor::GpsPos2;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

use crate::hydra_input::saveable::SaveableData;

fn option_numeric_to_f32<T: Into<f32>>(value: Option<T>) -> Option<f32> {
    match value {
        Some(value) => Some(value.into()),
        None => None,
    }
}
impl SaveableData for GpsPos2 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let time_of_week = match self.time_of_week {
            Some(time_of_week) => Some(time_of_week as i32),
            None => None,
        };
        let altitude = match self.altitude {
            Some(altitude) => Some(altitude as f32),
            None => None,
        };
        query!(
            "INSERT INTO rocket_sensor_gps_pos_2
			(rocket_sensor_message_id, time_of_week, undulation, altitude)
			VALUES ($1, $2, $3, $4)",
            rocket_message_id,
            time_of_week,
            option_numeric_to_f32(self.undulation),
            altitude
        )
        .execute(&mut **transaction)
        .await
    }
}
