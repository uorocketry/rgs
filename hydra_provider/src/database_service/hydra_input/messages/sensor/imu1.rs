use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::Imu1;
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

// export const rocket_sensor_imu_1 = pgTable("rocket_sensor_imu_1", {
//     rocket_sensor_message_id: integer("rocket_sensor_message_id")
//         .references(() => rocket_sensor_message.rocket_message_id)
//         .notNull()
//         .primaryKey(),
//     time_stamp: integer("time_stamp").notNull(),
//     status: integer("status").notNull(),
//     accelorometer_x: real("accelorometer_x"),
//     accelorometer_y: real("accelorometer_y"),
//     accelorometer_z: real("accelorometer_z"),
//     gyroscope_x: real("gyroscope_x"),
//     gyroscope_y: real("gyroscope_y"),
//     gyroscope_z: real("gyroscope_z"),
// });

impl SaveableData for Imu1 {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {
        query!(
            "INSERT INTO public.rocket_sensor_imu_1 (rocket_sensor_message_id,time_stamp,status,accelorometer_x,accelorometer_y,accelorometer_z,gyroscope_x,gyroscope_y,gyroscope_z)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            rocket_message_id,
            self.time_stamp as i32,
            self.status as i32,
            self.accelerometers[0],
            self.accelerometers[1],
            self.accelerometers[2],
            self.gyroscopes[0],
            self.gyroscopes[1],
            self.gyroscopes[2],
        )
        .execute(&mut **transaction)
        .await
    }
}
