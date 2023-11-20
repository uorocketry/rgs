import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../', '') };
	return defineConfig({
		test: {
			dir: './src',
			include: ['**.test.ts']
		},

		server: {
			port: parseInt(process.env['WEB_SERVER_PORT'] ?? '') || 3000,
			proxy: {
				'/db/': {
					target: 'http://localhost:' + (process.env['DB_REST_PORT'] || '3001'),
					changeOrigin: true,
					secure: false,
					rewrite: (path) => path.replace(/^\/db\//, '')
				}
			}
		},
		plugins: [sveltekit()],
		ssr: {
			noExternal: ['three']
		}
	});
};

export default config;
