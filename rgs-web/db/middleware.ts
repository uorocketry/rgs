import type { PluginOption, ViteDevServer } from "vite";
import type { Server as HTTPServer } from "http";
import { setupServer } from "./server";

export const dbMiddleware: PluginOption = {
  name: "dbMiddleware",
  configureServer(server: ViteDevServer) {
    setupServer(server.httpServer as HTTPServer);
  },
};

export default dbMiddleware;
