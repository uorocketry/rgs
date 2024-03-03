// const common_env = {};

module.exports = {
    name: "rgs",
    apps: [
        {
            name: "web",
            cwd: "web",
            script: "pnpm dev",
            // env: common_env,
        },
        // Run docker-compose up to start the database
        {
            name: "db",
            script: "docker-compose up",
            cwd: "./",
        },
    ],
};
