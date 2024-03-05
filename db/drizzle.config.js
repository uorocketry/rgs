import { env } from "process";

const connectionString =
    env["DATABASE_URL"] ??
    "postgres://postgres:postgres@localhost:5432/postgres";

/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./schema",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: { connectionString },
};
