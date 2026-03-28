/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
	theme: {
		extend: {
			colors: {
				'bg': '#050508',
				'bg-section': '#0a0a0f',
				'white': '#e8e6e3',
				'dim': '#55555e',
				'mid': '#8a8a94',
				'body-text': '#9a9aa4',
				'surface': 'rgba(10, 10, 15, 0.3)',
			},
fontFamily: {
			display: ['Space Grotesk', 'sans-serif'],
			mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
			sans: ['Space Grotesk', 'sans-serif']
		},
			fontSize: {
				hero: ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				h2: ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				body: ['18px', { lineHeight: '1.6' }]
			},
			spacing: {
				'section': '80px',
				'section-lg': '120px'
			},
			borderRadius: {
				industrial: '2px',
				sharp: '0px'
			},
			backgroundImage: {
				'grid-pattern': 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)'
			},
			backgroundSize: {
				'grid': '50px 50px'
			}
		}
	},
	plugins: []
};
