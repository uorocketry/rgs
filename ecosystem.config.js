module.exports = {
    name: "rgs",
    apps: [
        {
            name: "web",
            cwd: "web",
            script: "pnpm dev",
        },
        {
            name: "db",
            script: "docker compose up",
            cwd: "./",
        },
    ],
};
