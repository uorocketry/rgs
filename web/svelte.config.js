import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
