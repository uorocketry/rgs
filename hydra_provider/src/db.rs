use std::time::{SystemTime, UNIX_EPOCH};

use sqlx::postgres::PgPool;

use crate::hydra_iterator::HydraInput;

pub async fn db_save_hydra_input(pool: &PgPool, msg: HydraInput) {
    match msg {
        HydraInput::MavlinkRadioStatus(status) => {
            println!("Radio status: {:?}", status);

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

            let result =  sqlx::query!(
                "INSERT INTO rocket_radio_status (timestamp, rxerrors, fixed, rssi, remrssi, txbuf, noise, remnoise) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
            timestamp, rxerrors, fixed, rssi, remrssi, txbuf, noise, remnoise)
            .fetch_optional(pool);

            match result.await {
                Ok(_) => println!("Inserted radio status data"),
                Err(e) => println!("Error inserting radio status data: {:?}", e),
            }
        }
        HydraInput::RocketData(data) => {
            // println!("Rocket data: {:?}", data);

            // let msg_json = serde_json::to_string(&data.data).unwrap();
            // let result = sqlx::query!(
            //     "INSERT INTO rocket_message (timestamp, sender, message) VALUES ($1, $2, $3)",
            //     data.timestamp as i32,
            //     data.sender as i32,
            //     msg_json
            // )
            // .fetch_optional(&self.pool);

            // match result.await {
            //     Ok(_) => println!("Inserted rocket data"),
            //     Err(e) => println!("Error inserting rocket data: {:?}", e),
            // }
        }
        HydraInput::MavlinkHeartbeat(heartbeat) => {
            println!("Heartbeat: {:?}", heartbeat);
            // let timestamp = SystemTime::now()
            //     .duration_since(UNIX_EPOCH)
            //     .unwrap()
            //     .as_secs() as i32;

            // let result =
            //     sqlx::query!("INSERT INTO heartbeat (timestamp) VALUES ($1)", timestamp)
            //         .fetch_optional(&self.pool)
            //         .await;

            // match result {
            //     Ok(_) => println!("Inserted heartbeat data"),
            //     Err(e) => println!("Error inserting heartbeat data: {:?}", e),
            // }
        }
    }
    // panic!("Unknown message type")
}
