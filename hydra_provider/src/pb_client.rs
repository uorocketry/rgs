use std::time::{SystemTime, UNIX_EPOCH};

use sqlx::postgres::PgPool;

use crate::hydra_iterator::HydraInput;

pub struct PBClient {
    pool: sqlx::Pool<sqlx::Postgres>,
}

impl PBClient {
    pub async fn new() -> Self {
        PBClient {
            pool: PgPool::connect("postgres://uorocketry:uorocketry@localhost:5432/postgres")
                .await
                .unwrap(),
        }
    }

    pub async fn send(&self, msg: HydraInput) {
        match msg {
            HydraInput::MavlinkRadioStatus(status) => {
                let timestamp = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs() as i32;
                let rxerrors = status.rxerrors as i32;
                let fixed = status.fixed as i32;
                let rssi = status.rssi as i32;
                let remrssi = status.remrssi as i32;
                let txbuf = status.txbuf as i32;
                let noise = status.noise as i32;
                let remnoise = status.remnoise as i32;

                let result =  sqlx::query!("INSERT INTO radio_status (timestamp, rxerrors, fixed, rssi, remrssi, txbuf, noise, remnoise) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
                timestamp, rxerrors, fixed, rssi, remrssi, txbuf, noise, remnoise)
                .fetch_optional(&self.pool);

                match result.await {
                    Ok(_) => println!("Inserted radio status data"),
                    Err(e) => println!("Error inserting radio status data: {:?}", e),
                }
            }
            HydraInput::RocketData(data) => {
                println!("Rocket data: {:?}", data);

                let msg_json = serde_json::to_string(&data.data).unwrap();
                let result = sqlx::query!(
                    "INSERT INTO rocket_message (timestamp, sender, message) VALUES ($1, $2, $3)",
                    data.timestamp as i32,
                    data.sender as i32,
                    msg_json
                )
                .fetch_optional(&self.pool);

                match result.await {
                    Ok(_) => println!("Inserted rocket data"),
                    Err(e) => println!("Error inserting rocket data: {:?}", e),
                }
            }
            HydraInput::MavlinkHeartbeat() => {
                let timestamp = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs() as i32;

                let result =
                    sqlx::query!("INSERT INTO heartbeat (timestamp) VALUES ($1)", timestamp)
                        .fetch_optional(&self.pool)
                        .await;

                match result {
                    Ok(_) => println!("Inserted heartbeat data"),
                    Err(e) => println!("Error inserting heartbeat data: {:?}", e),
                }
            }
        }
        // panic!("Unknown message type")
    }
}
