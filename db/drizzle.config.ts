import type { Config } from "drizzle-kit";
export default {
    schema: "./schema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        // Local 5432 port
        connectionString:
            "postgres://uorocketry:uorocketry@localhost:5432/postgres",
    },
} satisfies Config;
