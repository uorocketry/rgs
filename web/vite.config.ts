import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import mkcert from 'vite-plugin-mkcert';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
				'/graphql': {
					target: 'ws://localhost:4000/v1',
					ws: true
				},
				'/hasura': {
					target: 'http://localhost:4000/console'
				}
			},
		},

		plugins: [
			mkcert(),
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
		},
		optimizeDeps: {
			exclude: ['@urql/svelte']
		}
	});
};

export default config;
