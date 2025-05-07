import { createClient } from "@libsql/client";
import seed from "./seed.sql?raw";

const DATABASE_URL = process.env.DATABASE_URL || "http://0.0.0.0:8080";
const client = createClient({
    url: DATABASE_URL,
});

// Delete comments and empty lines "--"
const noComments = seed.replace(/--.*/g, "");
const noEmptyLines = noComments.replace(/\n\s*\n/g, "");

const statements = noEmptyLines.split(";").map(s => s.trim()).filter(s => s.length > 0);

let n_errors = 0;
for (const statement of statements) {
    try {
        const r = await client.execute(statement);
        console.log(statement.split("\n")[0] + "  ...OK")
    } catch (e) {
        n_errors++;
        console.error("Statement failed:")
        console.log("--------------------------------")
        console.log(statement)
        console.log("--------------------------------")
        console.error(e)
        console.log("--------------------------------")
    }
}

if (n_errors > 0) {
    console.error(`Failed to execute ${n_errors} statements`);
    process.exit(1);
}

console.log(`Successfully executed ${statements.length} statements`);
