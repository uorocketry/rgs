use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::GpsVel;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for GpsVel {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
			"INSERT INTO public.rocket_sensor_gps_vel (rocket_sensor_message_id,time_stamp,status,time_of_week,velocity_x,velocity_y,velocity_z,velocity_acc_x,velocity_acc_y,velocity_acc_z,course,course_acc)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
			rocket_message_id,
			self.time_stamp as i32,
			self.status as i32,
			self.time_of_week as i32,
			self.velocity[0],
			self.velocity[1],
			self.velocity[2],
			self.velocity_acc[0],
			self.velocity_acc[1],
			self.velocity_acc[2],
			self.course as f32,
			self.course_acc as f32,
		)
		.execute(&mut **transaction)
		.await
    }
}
