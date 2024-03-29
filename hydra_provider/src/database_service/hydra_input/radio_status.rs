use super::saveable::SaveableData;
use messages::mavlink::uorocketry::RADIO_STATUS_DATA;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for RADIO_STATUS_DATA {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        _: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO rocket_radio_status
			(rxerrors, fixed, rssi, remrssi, txbuf, noise, remnoise) 
			VALUES ($1, $2, $3, $4, $5, $6, $7)",
            self.rxerrors as i32,
            self.fixed as i32,
            self.rssi as i32,
            self.remrssi as i32,
            self.txbuf as i32,
            self.noise as i32,
            self.remnoise as i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
