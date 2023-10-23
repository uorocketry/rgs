import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../', '') };
	return defineConfig({
		server: {
			port: parseInt(process.env['WEB_SERVER_PORT'] ?? '') || 3000,
			proxy: {
				'/db/': {
					target: 'http://localhost:' + (process.env['DB_REST_PORT'] || '3001'),
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
		}
	});
};

export default config;
