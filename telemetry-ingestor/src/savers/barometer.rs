use libsql::{params, Result, Transaction};

pub async fn save_barometer<T>(transaction: &Transaction, _baro: &T) -> Result<i64> {
    // Minimal insert to satisfy schema; fields can be populated as message schema stabilizes
    transaction
        .execute(
            "INSERT INTO Baro (timestamp_us, pressure_pa, temperature_c, altitude_m) VALUES (?, ?, ?, ?)",
            params![0i64, Option::<f64>::None, Option::<f64>::None, Option::<f64>::None],
        )
        .await?;
    Ok(transaction.last_insert_rowid())
}
