export const uorocketryTheme = {
	name: 'uorocketry',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`,
		'--theme-font-family-heading': `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '0px',
		'--theme-rounded-container': '0px',
		'--theme-border-base': '2px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '255 255 255',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '0 0 0',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #3774ba
		'--color-primary-50': '225 234 245', // #e1eaf5
		'--color-primary-100': '215 227 241', // #d7e3f1
		'--color-primary-200': '205 220 238', // #cddcee
		'--color-primary-300': '175 199 227', // #afc7e3
		'--color-primary-400': '115 158 207', // #739ecf
		'--color-primary-500': '55 116 186', // #3774ba
		'--color-primary-600': '50 104 167', // #3268a7
		'--color-primary-700': '41 87 140', // #29578c
		'--color-primary-800': '33 70 112', // #214670
		'--color-primary-900': '27 57 91', // #1b395b
		// secondary | #2a7567
		'--color-secondary-50': '223 234 232', // #dfeae8
		'--color-secondary-100': '212 227 225', // #d4e3e1
		'--color-secondary-200': '202 221 217', // #caddd9
		'--color-secondary-300': '170 200 194', // #aac8c2
		'--color-secondary-400': '106 158 149', // #6a9e95
		'--color-secondary-500': '42 117 103', // #2a7567
		'--color-secondary-600': '38 105 93', // #26695d
		'--color-secondary-700': '32 88 77', // #20584d
		'--color-secondary-800': '25 70 62', // #19463e
		'--color-secondary-900': '21 57 50', // #153932
		// tertiary | #2D2D2C
		'--color-tertiary-50': '224 224 223', // #e0e0df
		'--color-tertiary-100': '213 213 213', // #d5d5d5
		'--color-tertiary-200': '203 203 202', // #cbcbca
		'--color-tertiary-300': '171 171 171', // #ababab
		'--color-tertiary-400': '108 108 107', // #6c6c6b
		'--color-tertiary-500': '45 45 44', // #2D2D2C
		'--color-tertiary-600': '41 41 40', // #292928
		'--color-tertiary-700': '34 34 33', // #222221
		'--color-tertiary-800': '27 27 26', // #1b1b1a
		'--color-tertiary-900': '22 22 22', // #161616
		// success | #75bd6c
		'--color-success-50': '234 245 233', // #eaf5e9
		'--color-success-100': '227 242 226', // #e3f2e2
		'--color-success-200': '221 239 218', // #ddefda
		'--color-success-300': '200 229 196', // #c8e5c4
		'--color-success-400': '158 209 152', // #9ed198
		'--color-success-500': '117 189 108', // #75bd6c
		'--color-success-600': '105 170 97', // #69aa61
		'--color-success-700': '88 142 81', // #588e51
		'--color-success-800': '70 113 65', // #467141
		'--color-success-900': '57 93 53', // #395d35
		// warning | #b7be45
		'--color-warning-50': '244 245 227', // #f4f5e3
		'--color-warning-100': '241 242 218', // #f1f2da
		'--color-warning-200': '237 239 209', // #edefd1
		'--color-warning-300': '226 229 181', // #e2e5b5
		'--color-warning-400': '205 210 125', // #cdd27d
		'--color-warning-500': '183 190 69', // #b7be45
		'--color-warning-600': '165 171 62', // #a5ab3e
		'--color-warning-700': '137 143 52', // #898f34
		'--color-warning-800': '110 114 41', // #6e7229
		'--color-warning-900': '90 93 34', // #5a5d22
		// error | #d84342
		'--color-error-50': '249 227 227', // #f9e3e3
		'--color-error-100': '247 217 217', // #f7d9d9
		'--color-error-200': '245 208 208', // #f5d0d0
		'--color-error-300': '239 180 179', // #efb4b3
		'--color-error-400': '228 123 123', // #e47b7b
		'--color-error-500': '216 67 66', // #d84342
		'--color-error-600': '194 60 59', // #c23c3b
		'--color-error-700': '162 50 50', // #a23232
		'--color-error-800': '130 40 40', // #822828
		'--color-error-900': '106 33 32', // #6a2120
		// surface | #0a1526
		'--color-surface-50': '218 220 222', // #dadcde
		'--color-surface-100': '206 208 212', // #ced0d4
		'--color-surface-200': '194 197 201', // #c2c5c9
		'--color-surface-300': '157 161 168', // #9da1a8
		'--color-surface-400': '84 91 103', // #545b67
		'--color-surface-500': '10 21 38', // #0a1526
		'--color-surface-600': '9 19 34', // #091322
		'--color-surface-700': '8 16 29', // #08101d
		'--color-surface-800': '6 13 23', // #060d17
		'--color-surface-900': '5 10 19' // #050a13
	}
};
