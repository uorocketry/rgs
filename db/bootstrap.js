import fs from "fs";
import { execSync } from "child_process";

const drizzleFolderPath = "./drizzle";

// Check if "./drizzle" folder exists
if (!fs.existsSync(drizzleFolderPath)) {
    // Create "./drizzle" folder if it doesn't exist
    fs.mkdirSync(drizzleFolderPath);
}

// Run "pnpm up" command synchronously
execSync("pnpm run up", { stdio: "inherit" });

// Run "pnpm push" command synchronously
execSync("pnpm run push", { stdio: "inherit" });
