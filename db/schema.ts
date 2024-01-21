import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const rocketMessage = pgTable("rocket_message", {
    // u64 timestamp
    timestamp: integer("timestamp"),
    sender: integer("sender"),
    message: text("message"),
});

export const radioStatus = pgTable("radio_status", {
    timestamp: integer("timestamp"),
    sender: integer("sender"),
    rxerrors: integer("rxerrors"),
    fixed: integer("fixed"),
    rssi: integer("rssi"),
    remrssi: integer("remrssi"),
    txbuf: integer("txbuf"),
    noise: integer("noise"),
    remnoise: integer("remnoise"),
});

export const heartbeat = pgTable("heartbeat", {
    timestamp: integer("timestamp"),
});
