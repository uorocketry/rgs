function envRequired(name: string): string {
    const val = process.env[name];
    if (val === undefined || val === "") {
        console.error(`${name} is not set`);
        throw new Error(`${name} is not set`);
    }
    return val;
}

envRequired("DB_REST_PORT");
envRequired("DB_ADMIN");
envRequired("DB_ADMIN_PASSWORD");

console.info("Started PB Service");

import { spawn } from "child_process";
let platformName = process.platform;
const binName = `./bin/${platformName}/pocketbase`;
console.log(`Starting PocketBase server with ${binName}`);
const child = spawn(binName, [
    "serve",
    "--dir=pb_data",
    "--publicDir=pb_public",
    "--migrationsDir=pb_migrations",
    `--http=0.0.0.0:${process.env.DB_REST_PORT}`,
]);
// print output of child process
child.stdout.on("data", (data) => {
    console.log(`PB: ${data}`);
});

// Keep calling http://127.0.0.1:PORT/api/health until it responds
const TIMEOUT = 5000;
const start = Date.now();
let started = false;
while (!started) {
    try {
        const res = await fetch(
            `http://0.0.0.0:${process.env.DB_REST_PORT}/api/health`,
            {
                method: "GET",
            }
        );
        if (res.status === 200) {
            console.info("PocketBase server started successfully");
            started = true;
        }
    } catch (e) {
        // Ignore
    }
    if (Date.now() - start > TIMEOUT) {
        console.error("PocketBase server did not start in time");
        throw new Error("PocketBase server did not start in time");
    }
}

console.log("Health check passed, PocketBase server started successfully");
