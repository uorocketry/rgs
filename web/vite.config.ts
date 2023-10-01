import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../', '') };

	return defineConfig({
		server: {
			port: parseInt(process.env['PORT'] ?? '') || 3000
		},
		plugins: [sveltekit()]
	});
};

export default config;
