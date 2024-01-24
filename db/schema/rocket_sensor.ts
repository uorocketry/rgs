import { integer, pgTable, real } from "drizzle-orm/pg-core";
import { data_vec3, data_quaternion, rocket_message } from "./base";
import { relations } from "drizzle-orm";

export const rocket_sensor_message = pgTable("rocket_sensor_message", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull()
        .primaryKey(),
    component_id: integer("component_id").notNull(),
});

export const rocket_sensor_utc_time = pgTable("rocket_sensor_utc_time", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),
    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    day: integer("day").notNull(),
    hour: integer("hour").notNull(),
    minute: integer("minute").notNull(),
    second: integer("second").notNull(),
    nano_second: integer("nano_second").notNull(),
    gps_time_of_week: integer("gps_time_of_week").notNull(),
});

export const rocket_sensor_air = pgTable("rocket_sensor_air", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    pressure_abs: real("pressure_abs").notNull(),
    altitude: real("altitude").notNull(),
    pressure_diff: real("pressure_diff").notNull(),
    true_airspeed: real("true_airspeed").notNull(),
    air_temperature: real("air_temperature").notNull(),
});

export const rocket_sensor_quat = pgTable("rocket_sensor_quat", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    time_stamp: integer("time_stamp").notNull(),
    quaternion: integer("quaternion")
        .references(() => data_quaternion.id)
        .notNull(),
    euler_std_dev: integer("euler_std_dev")
        .references(() => data_vec3.id)
        .notNull(),
    status: integer("status").notNull(),
});

export const rocket_sensor_nav_1 = pgTable("rocket_sensor_nav_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    time_stamp: integer("time_stamp").notNull(),
    velocity: integer("velocity")
        .references(() => data_vec3.id)
        .notNull(),
    velocity_std_dev: integer("velocity_std_dev")
        .references(() => data_vec3.id)
        .notNull(),
});

export const rocket_sensor_nav_2 = pgTable("rocket_sensor_nav_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),
    position: integer("position")
        .references(() => data_vec3.id)
        .notNull(),
    position_std_dev: integer("position_std_dev")
        .references(() => data_vec3.id)
        .notNull(),
    undulation: real("undulation").notNull(),
    status: integer("status").notNull(),
});

export const rocket_sensor_imu_1 = pgTable("rocket_sensor_imu_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    accelerometers: integer("accelerometers")
        .references(() => data_vec3.id)
        .notNull(),

    gyroscopes: integer("gyroscopes")
        .references(() => data_vec3.id)
        .notNull(),
});

export const rocket_sensor_imu_2 = pgTable("rocket_sensor_imu_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),
    temperature: real("temperature").notNull(),
    delta_velocity: integer("delta_velocity")
        .references(() => data_vec3.id)
        .notNull(),
    delta_angle: integer("delta_angle")
        .references(() => data_vec3.id)
        .notNull(),
});

export const rocket_sensor_gps_vel = pgTable("rocket_sensor_gps_vel", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    time_of_week: integer("time_of_week").notNull(),
    velocity: integer("velocity")
        .references(() => data_vec3.id)
        .notNull(),
    velocity_acc: integer("velocity_acc")
        .references(() => data_vec3.id)
        .notNull(),
    course: real("course").notNull(),
    course_acc: real("course_acc").notNull(),
});

export const rocket_sensor_gps_pos_1 = pgTable("rocket_sensor_gps_pos_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    time_of_week: integer("time_of_week").notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    altitude: real("altitude").notNull(),
    undulation: real("undulation").notNull(),
});

export const rocket_sensor_gps_pos_2 = pgTable("rocket_sensor_gps_pos_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    latitude_accuracy: real("latitude_accuracy").notNull(),
    longitude_accuracy: real("longitude_accuracy").notNull(),
    altitude_accuracy: real("altitude_accuracy").notNull(),
    num_sv_used: integer("num_sv_used").notNull(),
    base_station_id: integer("base_station_id").notNull(),
    differential_age: integer("differential_age").notNull(),
});

export const rocket_sensor_current = pgTable("rocket_sensor_current", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    current: real("current").notNull(),
    rolling_avg: real("rolling_avg").notNull(),
});

export const rocket_sensor_voltage = pgTable("rocket_sensor_voltage", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    voltage: real("voltage").notNull(),
    rolling_avg: real("rolling_avg").notNull(),
});

export const rocket_sensor_regulator = pgTable("rocket_sensor_regulator", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    status: integer("status").notNull(),
});

export const rocket_sensor_temperature = pgTable("rocket_sensor_temperature", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull(),

    temperature: real("temperature").notNull(),
    rolling_avg: real("rolling_avg").notNull(),
});

export const rocket_sensor_relations = relations(
    rocket_sensor_message,
    ({ one }) => ({
        rocket_sensor_utc_time: one(rocket_sensor_utc_time),
        rocket_sensor_air: one(rocket_sensor_air),
        rocket_sensor_quat: one(rocket_sensor_quat),
        rocket_sensor_nav_1: one(rocket_sensor_nav_1),
        rocket_sensor_nav_2: one(rocket_sensor_nav_2),
        rocket_sensor_imu_1: one(rocket_sensor_imu_1),
        rocket_sensor_imu_2: one(rocket_sensor_imu_2),
        rocket_sensor_gps_vel: one(rocket_sensor_gps_vel),
        rocket_sensor_gps_pos_1: one(rocket_sensor_gps_pos_1),
        rocket_sensor_gps_pos_2: one(rocket_sensor_gps_pos_2),
        rocket_sensor_current: one(rocket_sensor_current),
        rocket_sensor_voltage: one(rocket_sensor_voltage),
        rocket_sensor_regulator: one(rocket_sensor_regulator),
        rocket_sensor_temperature: one(rocket_sensor_temperature),
    })
);
