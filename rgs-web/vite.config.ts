import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { viteMiddlewareServer } from "./src-server/middleware";

const config = (mode: string) => {
  process.env = { ...process.env, ...loadEnv(mode, "../", "") };
  return defineConfig({
    server: {
      port: parseInt(process.env["PORT"] ?? "") || 3000,
    },

    plugins: [sveltekit(), viteMiddlewareServer],
  });
};

export default config;
