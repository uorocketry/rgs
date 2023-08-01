const ZMQ_PORT = 3002;
const DB_REST_PORT = 8090;

const common_env = {
  // If you ever change these, you'll also need to change the ones in
  // pocketbase/pb_migrations/xxxxxxxxxxxxx_create_admin.js
  DB_ADMIN: "admin@admin.com",
  DB_ADMIN_PASSWORD: "admin",
  DB_REST_PORT: DB_REST_PORT,
  ZMQ_PORT: ZMQ_PORT,
  VITE_DB_REST_PORT: DB_REST_PORT,
  VITE_ZMQ_PORT: ZMQ_PORT,
};

module.exports = {
  name: "rgs",
  apps: [
    {
      name: "db",
      script: "cd db && pnpm dev",
      env: common_env,
    },
    {
      name: "web",
      script: "cd web && pnpm install && pnpm dev",
      env: common_env,
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
