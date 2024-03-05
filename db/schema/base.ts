import { relations } from "drizzle-orm";
import {
    pgTable,
    integer,
    serial,
    text,
    real,
    timestamp,
} from "drizzle-orm/pg-core";
import { rocket_command } from "./rocket_command";
import { rocket_log } from "./rocket_log";
import { rocket_state } from "./rocket_state";
import { rocket_sensor_message } from "./rocket_sensor";

export const rocket_radio_status = pgTable("rocket_radio_status", {
    created_at: timestamp("created_at").notNull().defaultNow(),
    rxerrors: integer("rxerrors").notNull(),
    fixed: integer("fixed").notNull(),
    rssi: integer("rssi").notNull(),
    remrssi: integer("remrssi").notNull(),
    txbuf: integer("txbuf").notNull(),
    noise: integer("noise").notNull(),
    remnoise: integer("remnoise").notNull(),
});

export const rocket_heartbeat = pgTable("rocket_heartbeat", {
    created_at: timestamp("created_at").notNull().defaultNow(),
    custom_mode: integer("custom_mode").notNull(),
    mavtype: integer("mavtype").notNull(),
    autopilot: integer("autopilot").notNull(),
    base_mode: integer("base_mode").notNull(),
    system_status: integer("system_status").notNull(),
    mavlink_version: integer("mavlink_version").notNull(),
});

export const rocket_message = pgTable("rocket_message", {
    created_at: timestamp("created_at").notNull().defaultNow(),
    id: serial("id").primaryKey(),
    time_stamp: integer("time_stamp").notNull(),
    sender: text("sender").notNull(),
    message_type: text("message_type").notNull(),
});

export const rocket_message_relations = relations(
    rocket_message,
    ({ one }) => ({
        rocket_state: one(rocket_state),
        rocket_log: one(rocket_log),
        rocket_command: one(rocket_command),
        rocket_sensor: one(rocket_sensor_message),
    })
);

export const data_quaternion = pgTable("data_quaternion", {
    id: serial("id").primaryKey(),
    x: real("w").notNull(),
    y: real("x").notNull(),
    z: real("y").notNull(),
    w: real("z").notNull(),
});

export const data_vec3 = pgTable("data_vec3", {
    id: serial("id").primaryKey(),
    x: real("x").notNull(),
    y: real("y").notNull(),
    z: real("z").notNull(),
});

export const web_layout = pgTable("web_layout", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().default("Untitled Layout"),
    layout: text("layout").notNull().default("{}"),
});
