const path = require("path");

const DATABASE_URL =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres";

const SCHEMA_NAME = "hdb_catalog";

module.exports = {
    DATABASE_URL,
    SCHEMA_NAME,
    FILE,
};
