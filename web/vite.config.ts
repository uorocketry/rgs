import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

const cesiumSource = './node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = 'cesium';

const config = (mode: string) => {
	// Make environment variables available from .env available
	process.env = { ...process.env, ...loadEnv(mode, '../', '') };
	return defineConfig({
		test: {
			dir: './src',
			include: ['**.test.ts']
		},

		server: {
			allowedHosts: true,
			port: parseInt(process.env['WEB_SERVER_PORT'] ?? '') || 3000
		},

		plugins: [
			tailwindcss(),
			sveltekit(),
			viteStaticCopy({
				targets: [
					{ src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
					{ src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
					{ src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
					{ src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl }
				]
			})
		],
		ssr: {
			noExternal: ['three']
		}
	});
};

export default config;

