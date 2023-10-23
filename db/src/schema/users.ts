import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    fullName: text("full_name", { length: 256 }).notNull().default(""),
    lastName: text("last_name", { length: 256 }).notNull().default(""),
  },
  (users) => ({
    nameIdx: index("name_idx").on(users.fullName),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
