import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";

export const rocket_log = pgTable("rocket_log", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull()
        .primaryKey(),
    level: text("level").notNull(),
    event: text("event").notNull(),
});
