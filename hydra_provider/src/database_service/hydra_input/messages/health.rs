use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use messages::health::{Health, HealthData, HealthStatus};
use crate::database_service::hydra_input::saveable::SaveableData;

impl SaveableData for Health {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		let result = query!(
			"INSERT INTO rocket_health
				(rocket_message_id, status)
				VALUES ($1, $2)",
			rocket_message_id,
			format!("{:?}", self.status)
		)
		.execute(&mut **transaction)
		.await;

		if result.is_err() {
			return result;
		}

		match &self.data {
			HealthData::HealthStatus(status) => status.save(transaction, rocket_message_id).await,
		}
	}
}

impl SaveableData for HealthStatus {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>,
		rocket_message_id: i32,
	) -> Result<PgQueryResult, Error> {
		query!(
			"INSERT INTO rocket_health_status
							(rocket_health_id, v5, v3_3, pyro_sense, vcc_sense, int_v5, int_v3_3, ext_v5, ext_3v3, failover_sense)
							VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
			rocket_message_id,
			self.v5.map(|x| x as i32),
			self.v3_3.map(|x| x as i32),
			self.pyro_sense.map(|x| x as i32),
			self.vcc_sense.map(|x| x as i32),
			self.int_v5.map(|x| x as i32),
			self.int_v3_3.map(|x| x as i32),
			self.ext_v5.map(|x| x as i32),
			self.ext_3v3.map(|x| x as i32),
			self.failover_sense.map(|x| x as i32),
		)
		.execute(&mut **transaction)
		.await
	}
}