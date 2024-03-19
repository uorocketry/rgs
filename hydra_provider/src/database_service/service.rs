use sqlx::PgPool;
use std::sync::Arc;

use crate::database_service::hydra_input::saveable::SaveableData;
use crate::hydra_input::HydraInput;

pub struct DatabaseService {
    pool: Arc<PgPool>,
}

impl DatabaseService {
    pub async fn new(address: &str) -> DatabaseService {
        DatabaseService {
            pool: Arc::new(PgPool::connect(address).await.unwrap()),
        }
    }

    pub async fn save(&self, hydra_input: HydraInput) -> Result<(), sqlx::Error> {
        let mut transaction = self.pool.begin().await.unwrap();
        let result = match hydra_input {
            HydraInput::Heartbeat(message) => message.save(&mut transaction, 0).await,
            HydraInput::RadioStatus(message) => message.save(&mut transaction, 0).await,
            HydraInput::Message(message) => message.save(&mut transaction, 0).await,
        };

        match result {
            Ok(_) => transaction.commit().await,
            Err(error) => {
                let rollback_result = transaction.rollback().await;
                if rollback_result.is_err() {
                    return rollback_result;
                }
                Err(error)
            }
        }
    }
}
