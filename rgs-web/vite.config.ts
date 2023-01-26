import serverPlugin from "./zmq/serverPlugin";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

const config = (mode: string) => {
  process.env = { ...process.env, ...loadEnv(mode, "../environments", "") };
  return defineConfig({
    plugins: [sveltekit(), serverPlugin],
  });
};

export default config;
