import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { viteMiddlewareServer } from './io/middleware';
import fs from 'fs';


const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../environments', '') };

	return defineConfig({
		server: {
			port: parseInt(process.env['PORT'] ?? '') || 3000,
			https: {
				key: fs.readFileSync(`${__dirname}/key.pem`),
				cert: fs.readFileSync(`${__dirname}/cert.pem`)
			},
			proxy: {}

		},
		plugins: [sveltekit(), viteMiddlewareServer]
	});
};

export default config;
