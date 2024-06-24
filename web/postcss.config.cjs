const { tailwindTransform } = require('postcss-lit');

module.exports = {
	plugins: [require('tailwindcss'), require('autoprefixer')]
};
