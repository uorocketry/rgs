use messages::{Data, Message};
use sqlx::{query, Postgres, Transaction, postgres::PgQueryResult, Error};
use super::saveable::SaveableData;

pub mod health;
pub mod state;
pub mod log;
pub mod sensor;
pub mod command;

impl SaveableData for Message {
	async fn save(
		&self,
		transaction: &mut Transaction<'_, Postgres>, 
		_: i32
	) -> Result<PgQueryResult, Error> {
		let message_type = match self.data {
			Data::Health(_) => "health",
			Data::State(_) => "state",
			Data::Sensor(_) => "sensor",
			Data::Log(_) => "log",
			Data::Command(_) => "command",
		};

		let result = query!(
			"INSERT INTO rocket_message
				(time_stamp, sender, message_type)
				VALUES ($1, $2, $3)
				RETURNING id",
			self.timestamp as i32,
			format!("{:?}", self.sender),
			message_type
		)
		.fetch_one(&mut **transaction)
		.await;

		if result.is_err() {
			return Err(result.err().unwrap());
		}

		let record = result.unwrap();
		match &self.data {
			Data::Health(data) => data.save(transaction, record.id).await,
			Data::State(data) => data.save(transaction, record.id).await,
			Data::Sensor(data) => data.save(transaction, record.id).await,
			Data::Log(data) => data.save(transaction, record.id).await,
			Data::Command(data) => data.save(transaction, record.id).await,
		}
	}
}