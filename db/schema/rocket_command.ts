import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";
import { relations } from "drizzle-orm";

export const rocket_command = pgTable("rocket_command", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull(),
    id: serial("id").primaryKey(),
});

export const rocket_deploy_drogue_command = pgTable(
    "rocket_deploy_drogue_command",
    {
        rocket_command_id: integer("rocket_command_id")
            .references(() => rocket_command.id)
            .notNull(),
        val: boolean("val").notNull(),
    }
);

export const rocket_deploy_main_command = pgTable(
    "rocket_deploy_main_command",
    {
        rocket_command_id: integer("rocket_command_id")
            .references(() => rocket_command.id)
            .notNull(),
        val: boolean("val").notNull(),
    }
);

export const rocket_power_down_command = pgTable("rocket_power_down_command", {
    rocket_command_id: integer("rocket_command_id")
        .references(() => rocket_command.id)
        .notNull(),
    sender: text("sender").notNull(),
});

export const rocket_radio_rate_change_command = pgTable(
    "rocket_radio_rate_change_command",
    {
        rocket_command_id: integer("rocket_command_id")
            .references(() => rocket_command.id)
            .notNull(),
        rate: text("rate").notNull(),
    }
);

export const rocket_command_relations = relations(
    rocket_command,
    ({ one }) => ({
        rocket_deploy_drogue_command: one(rocket_deploy_drogue_command),
        rocket_deploy_main_command: one(rocket_deploy_main_command),
        rocket_power_down_command: one(rocket_power_down_command),
        rocket_radio_rate_change_command: one(rocket_radio_rate_change_command),
    })
);
