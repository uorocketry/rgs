import Database from "bun:sqlite";
import { sql } from "drizzle-orm";
import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

let _db: BunSQLiteDatabase | null = null;
export function getDatabase() {
  if (_db) {
    return _db;
  }
  const db = new Database(`./db_data/db.sqlite`, { create: true });
  _db = drizzle(db);
  _db.run(sql`PRAGMA foreign_keys = ON;`);
  migrate(_db, { migrationsFolder: "drizzle" });

  // createMigrationsTableIfNotExist();

  return _db;
}
