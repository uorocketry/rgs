import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

const cesiumSource = './node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = './node_modules/cesium/Build/Cesium';

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
				// replace api tiles by 127.0.0.1:6565
				'/api/tiles': {
					target: 'http://127.0.0.1:6565',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},

		plugins: [
			sveltekit(),
			viteStaticCopy({
				targets: [
					{ src: `${cesiumSource}/ThirdParty/**/*`, dest: cesiumBaseUrl },
					{ src: `${cesiumSource}/Workers/**/*`, dest: cesiumBaseUrl },
					{ src: `${cesiumSource}/Assets/**/*`, dest: cesiumBaseUrl },
					{ src: `${cesiumSource}/Widgets/**/*`, dest: cesiumBaseUrl }
				]
			})
		],
		ssr: {
			noExternal: ['three']
		}
	});
};

export default config;
