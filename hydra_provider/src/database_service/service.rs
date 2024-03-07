use sqlx::PgPool;
use std::sync::Arc;

use crate::data_feed_service::message::HydraInput;

pub struct DatabaseService {
    pool: Arc<PgPool>,
}

impl DatabaseService {
    pub async fn new(address: &str) -> DatabaseService {
        DatabaseService {
            pool: Arc::new(PgPool::connect(address).await.unwrap()),
        }
    }

    pub fn save(&self, message: HydraInput) {}
}
