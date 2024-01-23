import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { rocket_message } from "./base";

export const rocket_state = pgTable("rocket_state", {
    rocket_message_id: integer("rocket_message_id")
        .references(() => rocket_message.id)
        .notNull(),
    state: text("state").notNull(),
});
