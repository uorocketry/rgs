module.exports = {
  name: "rgs",
  apps: [
    {
      name: "db",
      script: "cd db && pnpm dev",
      env: {
        // If you ever change these, you'll also need to change the ones in
        // pocketbase/pb_migrations/xxxxxxxxxxxxx_create_admin.js
        DB_ADMIN: "admin@admin.com",
        DB_ADMIN_PASSWORD: "admin",
        DB_REST_PORT: 8090,
        ZMQ_PORT: 3002,
      },
    },
    {
      name: "web",
      script: "cd web && pnpm install && pnpm dev",
      env: {
        VITE_DB_REST_PORT: 8090,
        VITE_ZMQ_PORT: 3002,
      },
    },
    {
      name: "pocketbase",
      script: "cd pocketbase && ./pocketbase serve",
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
