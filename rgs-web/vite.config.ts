import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { viteMiddlewareServer } from "./src-server/middleware";

const config = (mode: string) => {
  process.env = { ...process.env, ...loadEnv(mode, "../environments", "") };
  return defineConfig({
    server: {
      port: 3000,
      hmr: {
        port: 3001,
        protocol: "ws",
      },
    },
    plugins: [sveltekit(), viteMiddlewareServer],
  });
};

export default config;
