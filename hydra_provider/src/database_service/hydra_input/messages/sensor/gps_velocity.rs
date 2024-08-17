use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsVel;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

fn option_numeric_to_i32<T: Into<i32>>(value: Option<T>) -> Option<i32> {
    match value {
        Some(value) => Some(value.into()),
        None => None,
    }
}

impl SaveableData for GpsVel {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        let velocity = match self.velocity {
            Some(arr) => arr.iter().map(|&x| Some(x as f32)).collect(),
            None => vec![None, None, None],
        };
        let status_as_i32 = self
            .status
            .get_status()
            .map(|status| status as i32)
            .unwrap_or(-1);
        let time_of_week = match self.time_of_week {
            Some(time_of_week) => Some(time_of_week as i32),
            None => None,
        };

        query!(
			"INSERT INTO public.rocket_sensor_gps_vel (rocket_sensor_message_id, time_stamp, status, time_of_week, velocity_x, velocity_y, velocity_z, course)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			rocket_message_id,
			self.time_stamp as i32,
			status_as_i32,
			time_of_week,
			velocity[0],
			velocity[1],
			velocity[2],
			self.course,
		)
		.execute(&mut **transaction)
		.await
    }
}
