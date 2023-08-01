import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { viteMiddlewareServer } from './io/middleware';

const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../environments', '') };

	return defineConfig({
		server: {
			port: parseInt(process.env['PORT'] ?? '') || 3000
		},
		plugins: [sveltekit(), viteMiddlewareServer]
	});
};

export default config;
