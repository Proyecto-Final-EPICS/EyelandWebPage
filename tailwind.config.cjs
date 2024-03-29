/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	safelist: [
		'font-sans',
		'font-serif',
		'font-mono',
		'border-black',
		'tracking-normal',
		'tracking-wide'
	],
	theme: {
		extend: {
			keyframes: {
				'animate-entrance': {
					'0%': { opacity: 0, transform: 'translateX(-200px)' },
					'100%': { opacity: 1, transform: 'translateX(0px)' }
				},
				appear: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				playing: {
					'0%': {
						boxShadow: '0px 0px 4px 1px #0D9748'
					},
					'50%': {
						boxShadow: 'none'
					},
					'100%': {
						boxShadow: '0px 0px 4px 1px #0D9748'
					}
				}
			},
			animation: {
				'entrance-1': 'animate-entrance 0.5s 0.5s backwards',
				'entrance-2': 'animate-entrance 0.5s 0.6s backwards',
				'entrance-3': 'animate-entrance 0.5s 0.7s backwards',
				'entrance-4': 'animate-entrance 0.5s 0.8s backwards',
				appear: 'appear 0.5s',
				playing: 'playing 2s infinite linear'
			},
			boxShadow: {
				lateralNavbar: '4px 0px 4px rgba(0, 0, 0, 0.25)',
				buttonNavbar: '0px 4px 4px rgba(0, 0, 0, 0.15)',
				tooltipMenu: '0px 4px 8px rgba(0, 0, 0, 0.25)',
				form: '0px 3px 8px rgba(0, 0, 0, 0.25)',
				card: '0px 3px 8px rgba(0, 0, 0, 0.25)'
			},
			fontFamily: {
				Poppins: ['Poppins', 'sans-serif']
			},
			colors: {
				'green-primary': '#0D9748',
				'green-secondary': '#41FB99',
				'green-tertiary': '#9BE931',
				'green-quaternary': '#038741',
				'green-quinary': '#00EA17',
				'yellow-primary': '#FBFF48',
				'red-primary': '#DB3A3A',
				'red-secondary': '#FF7575',
				'pink-primary': '#FF75F1',
				'orange-primary': '#FC8507',
				whitish: '#F8F8F8',
				'gray-primary': '#A9A9A9',
				'gray-secondary': '#6C6C6C',
				'gray-tertiary': '#ECECEC',
				'blue-primary': '#1BA4CF',
				'blue-secondary': '#75ACFF'
			},
			dropShadow: {
				logoDropShadow: '0px 4px 4px rgba(0, 0, 0, 0.20)'
			}
		}
	},
	plugins: [],
	safelist: [
		{
			pattern:
				/(bg|text|border)-(green|yellow|red|blue|orange|whitish|gray|black|white|purple|pink|indigo|teal|cyan|lime|emerald|fuchsia|violet|rose)-(primary|secondary|tertiary|quaternary|quinary)/
		}
	]
};
