import type { Config } from "drizzle-kit";
import { env } from "process";

const connectionString =
    env["DATABASE_URL"] ??
    "postgres://postgres:postgres@localhost:5432/postgres";

export default {
    schema: "./schema",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: { connectionString },
} satisfies Config;
