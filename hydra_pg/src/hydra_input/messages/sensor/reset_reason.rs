use core::fmt;
use std::fmt::{Display, Formatter};

use crate::hydra_input::saveable::SaveableData;
use messages::sensor::ResetReason;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

impl SaveableData for ResetReason {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_reset_reason (
                rocket_sensor_message_id,
                reset_reason
            ) VALUES ($1, $2)",
            rocket_message_id,
            format!("{:?}", self)
        )
        .execute(&mut **transaction)
        .await
    }
}
