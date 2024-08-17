import { doublePrecision, integer, pgTable, real } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";

export const rocket_sensor_message = pgTable("rocket_sensor_message", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull()
        .primaryKey(),
    component_id: integer("component_id").notNull(),
});

// UtcTime
export const rocket_sensor_utc_time = pgTable("rocket_sensor_utc_time", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    year: integer("year"),
    month: integer("month"),
    day: integer("day"),
    hour: integer("hour"),
    minute: integer("minute"),
    second: integer("second"),
    nano_second: integer("nano_second"),
    gps_time_of_week: integer("gps_time_of_week"),
});

// Air
export const rocket_sensor_air = pgTable("rocket_sensor_air", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),

    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    pressure_abs: real("pressure_abs"),
    altitude: real("altitude"),
    pressure_diff: real("pressure_diff"),
    true_airspeed: real("true_airspeed"),
    air_temperature: real("air_temperature"),
});

// EkfQuat
export const rocket_sensor_quat = pgTable("rocket_sensor_quat", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    quat_w: real("quat_w"),
    quat_x: real("quat_x"),
    quat_y: real("quat_y"),
    quat_z: real("quat_z"),
    euler_std_dev_x: real("euler_std_dev_x"),
    euler_std_dev_y: real("euler_std_dev_y"),
    euler_std_dev_z: real("euler_std_dev_z"),
    status: integer("status").notNull(),
});

// EkfNav1
export const rocket_sensor_ekf_nav_1 = pgTable("rocket_sensor_ekf_nav_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    velocity_x: real("velocity_x"),
    velocity_y: real("velocity_y"),
    velocity_z: real("velocity_z"),
});

// EkfNav2
export const rocket_sensor_ekf_nav_2 = pgTable("rocket_sensor_ekf_nav_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    position_x: real("position_x"),
    position_y: real("position_y"),
    position_z: real("position_z"),
    undulation: real("undulation"),
});

// EkfNavAcc
export const rocket_sensor_ekf_nav_acc = pgTable("rocket_sensor_ekf_nav_acc", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    status: integer("status").notNull(),
    velocity_std_dev_x: real("velocity_std_dev_x"),
    velocity_std_dev_y: real("velocity_std_dev_y"),
    velocity_std_dev_z: real("velocity_std_dev_z"),
    position_std_dev_x: real("position_std_dev_x"),
    position_std_dev_y: real("position_std_dev_y"),
    position_std_dev_z: real("position_std_dev_z"),
});

// Imu1
export const rocket_sensor_imu_1 = pgTable("rocket_sensor_imu_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    accelorometer_x: real("accelorometer_x"),
    accelorometer_y: real("accelorometer_y"),
    accelorometer_z: real("accelorometer_z"),
    gyroscope_x: real("gyroscope_x"),
    gyroscope_y: real("gyroscope_y"),
    gyroscope_z: real("gyroscope_z"),
});


// Imu2
export const rocket_sensor_imu_2 = pgTable("rocket_sensor_imu_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    temperature: real("temperature"),
    delta_velocity_x: real("delta_velocity_x"),
    delta_velocity_y: real("delta_velocity_y"),
    delta_velocity_z: real("delta_velocity_z"),
    delta_angle_x: real("delta_angle_x"),
    delta_angle_y: real("delta_angle_y"),
    delta_angle_z: real("delta_angle_z"),
});


// #[common_derives]
// pub struct NavPosLlh {
//     pub height_msl: f64,
//     pub longitude: f64,
//     pub latitude: f64, 
// }

// NavPosLlh
export const rocket_sensor_nav_pos_llh = pgTable("rocket_sensor_nav_pos_llh", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    height_msl: doublePrecision("height_msl").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    latitude: doublePrecision("latitude").notNull(),
});



// GpsVel
export const rocket_sensor_gps_vel = pgTable("rocket_sensor_gps_vel", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_of_week: integer("time_of_week"),
    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    velocity_x: real("velocity_x"),
    velocity_y: real("velocity_y"),
    velocity_z: real("velocity_z"),
    course: real("course"),
});

// GpsVelAcc
export const rocket_sensor_gps_vel_acc = pgTable("rocket_sensor_gps_vel_acc", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    course_acc: real("course_acc"),
    velocity_acc_x: real("velocity_acc_x"),
    velocity_acc_y: real("velocity_acc_y"),
    velocity_acc_z: real("velocity_acc_z"),
});

// GpsPos1
export const rocket_sensor_gps_pos_1 = pgTable("rocket_sensor_gps_pos_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),

    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
});

// GpsPos2
export const rocket_sensor_gps_pos_2 = pgTable("rocket_sensor_gps_pos_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_of_week: integer("time_of_week"),
    undulation: real("undulation"),
    altitude: real("altitude"),
});

// GpsPosAcc
export const rocket_sensor_gps_pos_acc = pgTable("rocket_sensor_gps_pos_acc", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    latitude_accuracy: real("latitude_accuracy"),
    longitude_accuracy: real("longitude_accuracy"),
    altitude_accuracy: real("altitude_accuracy"),
    num_sv_used: integer("num_sv_used"),
    base_station_id: integer("base_station_id"),
    differential_age: integer("differential_age"),
});


// Recovery Sensing
export const rocket_sensor_recovery_sensing = pgTable("rocket_sensor_recovery_sensing", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    drogue_current: integer("drogue_current"),
    main_current: integer("main_current"),
    drogue_voltage: integer("drogue_voltage"),
    main_voltage: integer("main_voltage"),
});