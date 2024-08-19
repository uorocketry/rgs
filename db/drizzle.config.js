import { env } from "process";

const connectionString =
  env["DATABASE_URL"] ?? "postgres://postgres:postgres@localhost:5432/postgres";

/** @type { import("drizzle-kit").Config } */
export default {
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./schema",
  migrations: {
    tableName: "drizzle_migrations",
    schema: "public",
  },
  dbCredentials: {
    url: connectionString,
  },
};
