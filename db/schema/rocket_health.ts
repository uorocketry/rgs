import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";
import { relations } from "drizzle-orm";

export const rocket_health = pgTable("rocket_health", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull()
        .primaryKey(),

    status: text("status").notNull(),
});

export const rocket_health_status = pgTable("rocket_health_status", {
    rocket_health_id: integer("rocket_health_id")
        .references(() => rocket_health.rocket_message_id)
        .notNull()
        .primaryKey(),
    v5: integer("v5"),
    v3_3: integer("v3_3"),
    pyro_sense: integer("pyro_sense"),
    vcc_sense: integer("vcc_sense"),
    int_v5: integer("int_v5"),
    int_v3_3: integer("int_v3_3"),
    ext_v5: integer("ext_v5"),
    ext_3v3: integer("ext_3v3"),
    failover_sense: integer("failover_sense"),
});

export const rocket_health_relations = relations(rocket_health, ({ one }) => ({
    rocket_health_status: one(rocket_health_status),
}));
