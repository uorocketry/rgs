import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const rocketMessageDiscriminator = pgEnum(
    "rocket_message_discriminator",
    ["state", "sensor", "log", "command"]
);

export const rocketMessage = pgTable("rocket_message", {
    timestamp: timestamp("timestamp", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
    message: text("message"),
});
