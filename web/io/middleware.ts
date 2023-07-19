import type { PluginOption, ViteDevServer } from 'vite';
import type { Server as HTTPServer } from 'http';
import { setupServer } from './server';

export const viteMiddlewareServer: PluginOption = {
	name: 'ioMiddleware',
	configureServer(server: ViteDevServer) {
		setupServer(server.httpServer as HTTPServer);
	}
};

export default viteMiddlewareServer;
