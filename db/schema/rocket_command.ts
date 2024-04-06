import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";

export const rocket_command = pgTable("rocket_command", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull()
        .primaryKey(),
});

export const rocket_deploy_drogue_command = pgTable(
    "rocket_deploy_drogue_command",
    {
        rocket_command_id: integer("rocket_command_id")
            .references(() => rocket_command.rocket_message_id)
            .notNull()
            .primaryKey(),
        val: boolean("val").notNull(),
    }
);

export const rocket_deploy_main_command = pgTable(
    "rocket_deploy_main_command",
    {
        rocket_command_id: integer("rocket_command_id")
            .references(() => rocket_command.rocket_message_id)
            .notNull()
            .primaryKey(),
        val: boolean("val").notNull(),
    }
);

export const rocket_power_down_command = pgTable("rocket_power_down_command", {
    rocket_command_id: integer("rocket_command_id")
        .references(() => rocket_command.rocket_message_id)
        .notNull()
        .primaryKey(),
    board: text("board").notNull(),
});

export const rocket_radio_rate_change_command = pgTable(
    "rocket_radio_rate_change_command",
    {
        rocket_command_id: integer("rocket_command_id")
            .references(() => rocket_command.rocket_message_id)
            .notNull()
            .primaryKey(),
        rate: text("rate").notNull(),
    }
);
