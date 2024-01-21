import { pgTable, index, timestamp, text, doublePrecision, integer, foreignKey, serial, varchar } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const stocksRealTime = pgTable("stocks_real_time", {
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
	symbol: text("symbol").notNull(),
	price: doublePrecision("price"),
	dayVolume: integer("day_volume"),
},
(table) => {
	return {
		timeIdx: index("stocks_real_time_time_idx").on(table.time),
		ixSymbolTime: index("ix_symbol_time").on(table.time, table.symbol),
	}
});

export const authOtp = pgTable("auth_otp", {
	id: serial("id").primaryKey().notNull(),
	phone: varchar("phone", { length: 256 }),
	userId: integer("user_id").references(() => users.id),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	fullName: varchar("full_name", { length: 256 }),
},
(table) => {
	return {
		nameIdx: index("name_idx").on(table.fullName),
	}
});