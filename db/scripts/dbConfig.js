const path = require("path");

const DATABASE_URL =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres";

const SCHEMA_NAME = "hdb_catalog";
const DUMP_FOLDER = path.join(__dirname, "../hasura_dump");

const FILE = path.join(DUMP_FOLDER, SCHEMA_NAME + ".sql");

module.exports = {
    DATABASE_URL,
    SCHEMA_NAME,
    FILE,
    DUMP_FOLDER,
};
