const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const drizzleFolderPath = path.join(__dirname, "../drizzle");

// Create "./drizzle" folder if it doesn't exist
if (!fs.existsSync(drizzleFolderPath)) {
    fs.mkdirSync(drizzleFolderPath);
}

execSync(`npm run push`, { stdio: "inherit" });

// Run the restore_hasura.js script
require("./restore_hasura");

process.exit(0);
