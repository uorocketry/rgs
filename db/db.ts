import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const connection = postgres(
    "postgres://uorocketry:uorocketry@localhost:5432/postgres"
);
export const db = drizzle(connection, { schema });
