import { Command } from "commander";
import fs from "fs";

import { sql } from "drizzle-orm";
import { Hono } from "hono";
import process from "process";
import { getDatabase } from "./utils";

// On prgram exit, call db.close()
process.on("exit", () => {
  const db = getDatabase();
  db.run(sql`PRAGMA wal_checkpoint(TRUNCATE);`);
  console.log("Goodbye!");
});

const app = new Hono().get("/", (c) => c.text("Hello Bun!"));

// Create db_data folder if it doesn't exist
const dir = "./db_data";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const program = new Command().name("db").description("Database commands");

// Get all commands from src/commands
const commands = fs.readdirSync("./src/commands");
for (let i = 0; i < commands.length; i++) {
  const { default: command } = await import(`./commands/${commands[i]}`);
  // remove extension
  const cmdName = commands[i].split(".")[0];
  command(program.command(cmdName));
}

program.parse();
// console.log("🎉 Migrations complete!");

// export default app;
