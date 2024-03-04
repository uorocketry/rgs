const { execSync } = require("child_process");
const fs = require("fs");

const { DATABASE_URL, SCHEMA_NAME, FILE, DUMP_FOLDER } = require("./dbConfig");
const DUMP_COMMAND = `pg_dump ${DATABASE_URL} -n ${SCHEMA_NAME}`;

if (!fs.existsSync(DUMP_FOLDER)) {
    console.log(`Creating folder: ${DUMP_FOLDER}`);
    fs.mkdirSync(DUMP_FOLDER);
}

// If we have docker installed, use it, otherwise use the local postgres
try {
    execSync(`docker exec -i rgs_db_1 sh -c "${DUMP_COMMAND}" >${FILE}`);
} catch (error) {
    execSync(`${DUMP_COMMAND} >${FILE}`);
}
