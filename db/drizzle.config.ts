import type { Config } from "drizzle-kit";
import { env } from "process";

const connectionString =
    env["DATABASE_URL"] ??
    "postgres://uorocketry:uorocketry@0.0.0.0:5432/postgres";

export default {
    schema: "./schema",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString,
        database: "postgres",
    },
} satisfies Config;
