import type { Config } from "drizzle-kit";
export default {
    schema: "./schema",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        // Local 5432 port
        connectionString:
            "postgres://uorocketry:uorocketry@localhost:5432/postgres",
    },
} satisfies Config;
