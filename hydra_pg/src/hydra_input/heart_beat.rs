use super::saveable::SaveableData;
use messages::mavlink::uorocketry::HEARTBEAT_DATA;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for HEARTBEAT_DATA {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        _: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO rocket_heartbeat
			(custom_mode, mavtype, autopilot, base_mode, system_status, mavlink_version)
			VALUES ($1, $2, $3, $4, $5, $6)",
            self.custom_mode as i32,
            self.mavtype as i32,
            self.autopilot as i32,
            self.base_mode as i32,
            self.system_status as i32,
            self.mavlink_version as i32,
        )
        .execute(&mut **transaction)
        .await
    }
}
