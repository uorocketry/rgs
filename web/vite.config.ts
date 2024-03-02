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

		plugins: [sveltekit()],
		ssr: {
			noExternal: ['three']
		},
		optimizeDeps: {
			exclude: ['@urql/svelte']
		}
	});
};

export default config;
