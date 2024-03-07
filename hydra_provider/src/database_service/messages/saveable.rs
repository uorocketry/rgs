use sqlx::PgPool;

pub trait Saveable {
	fn save(pool: &PgPool);
}