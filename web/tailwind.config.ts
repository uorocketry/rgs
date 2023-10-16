import { skeleton } from '@skeletonlabs/tw-plugin';
import { join } from 'path';

// 1. Import the Skeleton plugin

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{svelte,js,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	plugins: [
		require('@tailwindcss/typography'),
		skeleton({
			themes: {
				preset: [
					{ name: 'rocket', enhancements: true },
					{ name: 'skeleton', enhancements: true }
				]
			}
		})
	]
};

export default config;
