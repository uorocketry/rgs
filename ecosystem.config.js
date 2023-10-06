const DB_REST_PORT = 8090;

const common_env = {
  // If you ever change these, you'll also need to change the ones in
  // pocketbase/pb_migrations/xxxxxxxxxxxxx_create_admin.js
  DB_ADMIN: "admin@admin.com",
  DB_ADMIN_PASSWORD: "admin",
  DB_REST_PORT: DB_REST_PORT,
  VITE_DB_REST_PORT: DB_REST_PORT,
  
  XPUB_PORT: 3002,  // PORT THAT SUBS CONNECT TO
  XSUB_PORT: 3003,  // PORT THAT PUBS CONNECT TO
};


module.exports = {
  name: "rgs",
  apps: [
    {
      name: "pb",
      cwd: "pb",
      script: "pnpm dev",
      env: common_env,
    },
    {
      name: "web",
      cwd: "web",
      script: "pnpm dev",
      env: common_env,
    },
    {
      name: "zmq_proxy",
      cwd: "zmq_proxy",
      script: "./scripts/dev.sh",
    }
  ]
};
