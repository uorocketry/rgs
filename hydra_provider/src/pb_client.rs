use sqlx::postgres::PgPool;

use crate::hydra_iterator::HydraInput;

pub struct PBClient {
    pool: Result<sqlx::Pool<sqlx::Postgres>, sqlx::Error>,
}

impl PBClient {
    pub async fn new(port: u32) -> Self {
        // TODO: Use env variables for this

        PBClient {
            pool: PgPool::connect("postgres://uorocketry:uorocketry@localhost:5432/postgres").await,
        }
    }

    pub async fn send(&self, msg: HydraInput) {
        println!("Sending message: {:?}", msg);
    }
}
