import { integer, pgTable, real } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";

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
        .notNull()
        .primaryKey(),
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
        .notNull()
        .primaryKey(),

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
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    quat_w: real("quat_w").notNull(),
    quat_x: real("quat_x").notNull(),
    quat_y: real("quat_y").notNull(),
    quat_z: real("quat_z").notNull(),
    euler_std_dev_x: real("euler_std_dev_x").notNull(),
    euler_std_dev_y: real("euler_std_dev_y").notNull(),
    euler_std_dev_z: real("euler_std_dev_z").notNull(),
    status: integer("status").notNull(),
});

export const rocket_sensor_nav_1 = pgTable("rocket_sensor_nav_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),

    time_stamp: integer("time_stamp").notNull(),
    velocity_x: real("velocity_x").notNull(),
    velocity_y: real("velocity_y").notNull(),
    velocity_z: real("velocity_z").notNull(),
    velocity_std_dev_x: real("velocity_std_dev_x").notNull(),
    velocity_std_dev_y: real("velocity_std_dev_y").notNull(),
    velocity_std_dev_z: real("velocity_std_dev_z").notNull(),
});

export const rocket_sensor_nav_2 = pgTable("rocket_sensor_nav_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    position_x: real("position_x").notNull(),
    position_y: real("position_y").notNull(),
    position_z: real("position_z").notNull(),
    position_std_dev_x: real("position_std_dev_x").notNull(),
    position_std_dev_y: real("position_std_dev_y").notNull(),
    position_std_dev_z: real("position_std_dev_z").notNull(),
    undulation: real("undulation").notNull(),
    status: integer("status").notNull(),
});

export const rocket_sensor_imu_1 = pgTable("rocket_sensor_imu_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    accelorometer_x: real("accelorometer_x").notNull(),
    accelorometer_y: real("accelorometer_y").notNull(),
    accelorometer_z: real("accelorometer_z").notNull(),
    gyroscope_x: real("gyroscope_x").notNull(),
    gyroscope_y: real("gyroscope_y").notNull(),
    gyroscope_z: real("gyroscope_z").notNull(),
});

export const rocket_sensor_imu_2 = pgTable("rocket_sensor_imu_2", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),
    temperature: real("temperature").notNull(),
    // delta_velocity: integer("delta_velocity")
    //     .references(() => data_vec3.id)
    //     .notNull(),
    delta_velocity_x: real("delta_velocity_x").notNull(),
    delta_velocity_y: real("delta_velocity_y").notNull(),
    delta_velocity_z: real("delta_velocity_z").notNull(),
    // delta_angle: integer("delta_angle")
    // .references(() => data_vec3.id)
    // .notNull(),
    delta_angle_x: real("delta_angle_x").notNull(),
    delta_angle_y: real("delta_angle_y").notNull(),
    delta_angle_z: real("delta_angle_z").notNull(),
});

export const rocket_sensor_gps_vel = pgTable("rocket_sensor_gps_vel", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),

    time_stamp: integer("time_stamp").notNull(),
    status: integer("status").notNull(),
    time_of_week: integer("time_of_week").notNull(),
    velocity_x: real("velocity_x").notNull(),
    velocity_y: real("velocity_y").notNull(),
    velocity_z: real("velocity_z").notNull(),
    velocity_acc_x: real("velocity_acc_x").notNull(),
    velocity_acc_y: real("velocity_acc_y").notNull(),
    velocity_acc_z: real("velocity_acc_z").notNull(),

    course: real("course").notNull(),
    course_acc: real("course_acc").notNull(),
});

export const rocket_sensor_gps_pos_1 = pgTable("rocket_sensor_gps_pos_1", {
    rocket_sensor_message_id: integer("rocket_sensor_message_id")
        .references(() => rocket_sensor_message.rocket_message_id)
        .notNull()
        .primaryKey(),

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
        .notNull()
        .primaryKey(),

    latitude_accuracy: real("latitude_accuracy").notNull(),
    longitude_accuracy: real("longitude_accuracy").notNull(),
    altitude_accuracy: real("altitude_accuracy").notNull(),
    num_sv_used: integer("num_sv_used").notNull(),
    base_station_id: integer("base_station_id").notNull(),
    differential_age: integer("differential_age").notNull(),
});
