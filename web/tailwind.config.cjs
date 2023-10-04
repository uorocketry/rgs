module.exports = {
	content: ['./src/**/*.{svelte,js,ts}'],
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				rgs: {
					primary: '#8F001A',
					'primary-content': '#FFFFFF',
					secondary: '#ffffff',
					accent: '#FFCF00',
					neutral: '#FFFFFF',
					"base-100": "#ffffff",
					info: '#FFCF00',
					success: '#36D399',
					warning: '#FFCF00',
					error: '#F87272'
				}
			}
		]
	}
};
