import { skeleton } from '@skeletonlabs/tw-plugin';
import { join } from 'path';
import { uorocketryTheme } from './src/lib/common/uorocketryTheme';
declare var require: any //to get rid of error cannot find name 'require' error

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
				custom: [uorocketryTheme]
			}
		})
	]
};

export default config;
