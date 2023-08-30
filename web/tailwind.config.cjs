module.exports = {
	content: ['./src/**/*.{svelte,js,ts}'],
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				rgs: {
					primary: '#006DB7',
					secondary: '#EC1C24',
					accent: '#FFCF00',
					neutral: '#EFEFEF',
					'base-100': '#FFFFFF',
					info: '#FFCF00',
					success: '#36D399',
					warning: '#FFCF00',
					error: '#F87272'
				}
			}
		]
	}
};
