import { createClient } from "@libsql/client";
import { parseSqlStatements } from "./sql";

const DATABASE_URL = process.env.DATABASE_URL || "http://0.0.0.0:8080";
const client = createClient({ url: DATABASE_URL });

const seed = await Bun.file(new URL("./seed.sql", import.meta.url)).text();
const statements = parseSqlStatements(seed);

let nErrors = 0;
for (const statement of statements) {
  try {
    await client.execute(statement);
    const firstLine = statement.split("\n")[0];
    console.log(`${firstLine}  ...OK`);
  } catch (e) {
    nErrors++;
    console.error("Statement failed:");
    console.log("--------------------------------");
    console.log(statement);
    console.log("--------------------------------");
    console.error(e);
    console.log("--------------------------------");
  }
}

if (nErrors > 0) {
  console.error(`Failed to execute ${nErrors} statements`);
  process.exit(1);
}

console.log(`Successfully executed ${statements.length} statements`);
