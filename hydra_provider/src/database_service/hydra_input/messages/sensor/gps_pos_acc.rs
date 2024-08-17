use crate::database_service::hydra_input::saveable::SaveableData;
use messages::sensor::{GpsPosAcc};
use sqlx::{postgres::PgQueryResult, query, Error, Postgres, Transaction};

// [common_derives]
// pub struct GpsPosAcc {
//     #[doc = "< Time in us since the sensor power up."]
//     pub time_stamp: u32,
//     #[doc = "< GPS position status, type and bitmask."]
//     pub status: GpsPositionStatus,
//     #[doc = "< 1 sigma latitude accuracy in meters."]
//     pub latitude_accuracy: Option<f32>,
//     #[doc = "< 1 sigma longitude accuracy in meters."]
//     pub longitude_accuracy: Option<f32>,
//     #[doc = "< 1 sigma altitude accuracy in meters."]
//     pub altitude_accuracy: Option<f32>,
//     #[doc = "< Number of space vehicles used to compute the solution (since version 1.4)."]
//     pub num_sv_used: Option<u8>,
//     #[doc = "< Base station id for differential corrections (0-4095). Set to 0xFFFF if differential corrections are not used (since version 1.4)."]
//     pub base_station_id: Option<u16>,
//     #[doc = "< Differential correction age in 0.01 seconds. Set to 0XFFFF if differential corrections are not used (since version 1.4)."]
//     pub differential_age: Option<u16>,
// }

// export const rocket_sensor_gps_pos_acc = pgTable("rocket_sensor_gps_pos_acc", {
//     rocket_sensor_message_id: integer("rocket_sensor_message_id")
//         .references(() => rocket_sensor_message.rocket_message_id)
//         .notNull()
//         .primaryKey(),
//     time_stamp: integer("time_stamp").notNull(),
//     status: integer("status").notNull(),
//     latitude_accuracy: real("latitude_accuracy"),
//     longitude_accuracy: real("longitude_accuracy"),
//     altitude_accuracy: real("altitude_accuracy"),
//     num_sv_used: integer("num_sv_used"),
//     base_station_id: integer("base_station_id"),
//     differential_age: integer("differential_age"),
// });
fn option_numeric_to_i32<T>(value: Option<T>) -> Option<i32> {
    match value {
        Some(val) => Some(val as i32),
        None => None,
    }
}

fn option_numeric_to_f32<T>(value: Option<T>) -> Option<f32> {
    match value {
        Some(val) => Some(val as f32),
        None => None,
    }
}

impl SaveableData for GpsPosAcc {
    async fn save(
        &self,
        transaction: &mut Transaction<'_, Postgres>,
        rocket_message_id: i32,
    ) -> Result<PgQueryResult, Error> {

        query!(
            "INSERT INTO public.rocket_sensor_gps_pos_acc (rocket_sensor_message_id, time_stamp, status, latitude_accuracy, longitude_accuracy, altitude_accuracy, num_sv_used, base_station_id, differential_age)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            rocket_message_id,
            time_stamp,

            
        )
        .execute(&mut **transaction)
        .await
    }
}
