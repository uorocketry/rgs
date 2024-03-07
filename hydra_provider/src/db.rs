use crate::{data_feeds::message::HydraInput, rocket_data::db_save_rocket_message};
use messages::mavlink::uorocketry::{HEARTBEAT_DATA, RADIO_STATUS_DATA};
use sqlx::postgres::{PgPool, PgQueryResult};

pub async fn db_save_hydra_input(pool: &PgPool, msg: HydraInput) -> Result<(), sqlx::Error> {
    match msg {
        HydraInput::RadioStatus(status) => {
            return db_save_radio_status(&pool, status).await.map(|_| ())
        }
        HydraInput::Message(data) => {
            return db_save_rocket_message(&pool, data).await;
        }
        HydraInput::Heartbeat(heartbeat) => {
            return db_save_rocket_heartbeat(&pool, heartbeat).await.map(|_| ())
        }
    }
}

async fn db_save_radio_status(
    pool: &PgPool,
    status: RADIO_STATUS_DATA,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_radio_status 
        (rxerrors, fixed, rssi, remrssi, txbuf, noise, remnoise) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)",
        status.rxerrors as i32,
        status.fixed as i32,
        status.rssi as i32,
        status.remrssi as i32,
        status.txbuf as i32,
        status.noise as i32,
        status.remnoise as i32,
    )
    .execute(pool)
    .await;
}

async fn db_save_rocket_heartbeat(
    pool: &PgPool,
    heartbeat: HEARTBEAT_DATA,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_heartbeat
        (custom_mode, mavtype, autopilot, base_mode, system_status, mavlink_version)
        VALUES ($1, $2, $3, $4, $5, $6)",
        heartbeat.custom_mode as i32,
        heartbeat.mavtype as i32,
        heartbeat.autopilot as i32,
        heartbeat.base_mode as i32,
        heartbeat.system_status as i32,
        heartbeat.mavlink_version as i32,
    )
    .execute(pool)
    .await;
}
