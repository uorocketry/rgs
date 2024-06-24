import { join } from 'path';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{svelte,js,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	plugins: [require('@tailwindcss/typography')]
};

export default config;
