const DB_REST_PORT = 3001;

const common_env = {
  // If you ever change these, you'll also need to change the ones in
  // pocketbase/pb_migrations/xxxxxxxxxxxxx_create_admin.js
  DB_ADMIN: "admin@admin.com",
  DB_ADMIN_PASSWORD: "admin",
  DB_REST_PORT: DB_REST_PORT,
  VITE_DB_REST_PORT: DB_REST_PORT,  
  INFLUXD_CONFIG_PATH: "./influxdb",
};


module.exports = {
  name: "rgs",
  apps: [
    {
      name: "web",
      cwd: "web",
      script: "pnpm dev",
      env: common_env,
    },
    // {
    //   name: "db",
    //   cwd: "db",
    //   script: "bun dev",
    //   env: common_env,
    // }
    {
      name: "pb",
      cwd: "pb",
      script: `./pocketbase serve --http=0.0.0.0:${DB_REST_PORT}`,
      env: common_env,
    },
  ]
};
