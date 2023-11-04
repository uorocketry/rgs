import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../', '') };
	const pbUrl = 'http://localhost:' + (process.env['DB_REST_PORT'] || '8090');
	return defineConfig({
		test: {
			dir: './src',
			include: ['**.test.ts']
			
		},

		server: {
			port: parseInt(process.env['WEB_SERVER_PORT'] ?? '') || 3000,
			proxy: {
				'/db/': {
					target: pbUrl,
					changeOrigin: true,
					secure: false,
					ws: true,
					configure: (proxy) => {
						proxy.on('proxyReq', (proxyReq, req) => {
							if (req.url) {
								// Remove the first path segment
								proxyReq.path = req?.url?.replace(/^\/[^/]+/, '');
							}
						});
					}
				}
			}
		},
		plugins: [sveltekit()],
		ssr: {
			noExternal: ['three']
		},
	});
};

export default config;
