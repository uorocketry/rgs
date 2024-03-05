use messages::{health::Health, state::State, Data, Log, Message};

use sqlx::{postgres::PgQueryResult, PgPool, Postgres, Transaction};

use crate::{rocket_command::add_rocket_command, rocket_sensor::db_save_rocket_sensor};

async fn db_save_rocket_message_base(
    rocket_message: Message,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<i32, sqlx::Error> {
    let msg_type = match rocket_message.data {
        Data::Health(_) => "health",
        Data::State(_) => "state",
        Data::Sensor(_) => "sensor",
        Data::Log(_) => "log",
        Data::Command(_) => "command",
    };

    let result = sqlx::query!(
        "INSERT INTO rocket_message
                (time_stamp, sender, message_type)
                VALUES ($1, $2, $3)
                RETURNING id",
        rocket_message.timestamp as i32,
        format!("{:?}", rocket_message.sender),
        msg_type
    )
    .fetch_one(&mut **transaction)
    .await;

    match result {
        Ok(res) => {
            return Ok(res.id);
        }
        Err(e) => {
            return Err(e);
        }
    }
}

pub async fn db_save_rocket_message(
    pool: &PgPool,
    rocket_message: Message,
) -> Result<(), sqlx::Error> {
    let mut transaction = pool.begin().await.unwrap();
    let message_id = db_save_rocket_message_base(rocket_message.clone(), &mut transaction).await?;

    match rocket_message.data {
        Data::Health(health) => db_save_rocket_health(message_id, health, &mut transaction).await?,
        Data::State(state) => db_save_rocket_state(message_id, state, &mut transaction).await?,
        Data::Sensor(sensor) => db_save_rocket_sensor(sensor, message_id, &mut transaction).await?,
        Data::Log(log) => db_save_rocket_log(message_id, log, &mut transaction).await?,
        Data::Command(cmd) => add_rocket_command(cmd, message_id, &mut transaction).await?,
    };

    let transaction_result = transaction.commit().await;

    if transaction_result.is_err() {
        return Err(transaction_result.err().unwrap());
    }
    return Ok(());
}

async fn db_save_rocket_state(
    rocket_message_id: i32,
    state: State,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_state
                        (rocket_message_id, state)
                        VALUES ($1, $2)",
        rocket_message_id,
        format!("{:?}", state)
    )
    .execute(&mut **transaction)
    .await;
}

async fn db_save_rocket_log(
    rocket_message_id: i32,
    log: Log,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let level = log.level;
    let event = log.event;
    return sqlx::query!(
        "INSERT INTO rocket_log
                        (rocket_message_id, level, event)
                        VALUES ($1, $2, $3)",
        rocket_message_id,
        format!("{:?}", level),
        format!("{:?}", event)
    )
    .execute(&mut **transaction)
    .await;
}

async fn db_save_rocket_health(
    rocket_message_id: i32,
    health: Health,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    let res = sqlx::query!(
        "INSERT INTO rocket_health
                        (rocket_message_id, status)
                        VALUES ($1, $2)",
        rocket_message_id,
        format!("{:?}", health.status)
    )
    .execute(&mut **transaction)
    .await;

    if res.is_err() {
        return res;
    }
    let health_status = health.data;

    match health_status {
        messages::health::HealthData::HealthStatus(health_status) => {
            return db_save_rocket_health_status(rocket_message_id, health_status, transaction)
                .await;
        }
    }
}

async fn db_save_rocket_health_status(
    rocket_message_id: i32,
    health_status: messages::health::HealthStatus,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<PgQueryResult, sqlx::Error> {
    return sqlx::query!(
        "INSERT INTO rocket_health_status
                        (rocket_health_id, v5, v3_3, pyro_sense, vcc_sense, int_v5, int_v3_3, ext_v5, ext_3v3, failover_sense)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        rocket_message_id,
        health_status.v5.map(|x| x as i32),
        health_status.v3_3.map(|x| x as i32),
        health_status.pyro_sense.map(|x| x as i32),
        health_status.vcc_sense.map(|x| x as i32),
        health_status.int_v5.map(|x| x as i32),
        health_status.int_v3_3.map(|x| x as i32),
        health_status.ext_v5.map(|x| x as i32),
        health_status.ext_3v3.map(|x| x as i32),
        health_status.failover_sense.map(|x| x as i32),
    )
    .execute(&mut **transaction)
    .await;
}
