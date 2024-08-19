import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// Create "./drizzle" folder if it doesn't exist
if (!existsSync("./drizzle")) {
  mkdirSync("./drizzle");
}

execSync(`npm run dk generate`, { stdio: "inherit" });

let tries = 0;
let maxTries = 5;
let ok = false;
// execSync(`npm run dk migrate`, { stdio: "inherit" });
while (tries < maxTries) {
  try {
    execSync(`npm run dk migrate`, { stdio: "inherit" });
    ok = true;
    break;
  } catch (error) {
    tries++;
    // sleep for 10 seconds
    console.log("Retrying in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

if (!ok) {
  console.error("Failed to run migrations");
  process.exit(1);
}

// Run the restore_hasura.js script
// import "./restore_hasura";
// require("./restore_hasura");
await import("./restore_hasura.js");

process.exit(0);
