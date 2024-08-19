const { execSync } = require("child_process");
const fs = require("fs");

const { DATABASE_URL, FILE } = require("./dbConfig");

// Check if restore file exists
if (!fs.existsSync(FILE)) {
  console.log(`Can't restore hasura as file "${FILE}" doesn't exist`);
  process.exit(0);
}

// Try to restore using docker if possible
try {
  execSync(`docker exec -i rgs_db_1 sh -c "psql ${DATABASE_URL}" <${FILE}`);
} catch (error) {
  console.log("Failed to restore using docker, trying local postgres...");
  execSync(`psql ${DATABASE_URL} <${FILE}`);
  console.log("Restore using local postgres successful");
}
