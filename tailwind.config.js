/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
	theme: {
		extend: {
			colors: {
				background: '#111111',
				surface: '#0D0D0E',
				'text-primary': '#E5E5E2',
				'text-secondary': '#A0A0A0',
				'text-body': '#888888',
				'slash': '#666666'
			},
			fontFamily: {
				display: ['Space Grotesk', 'sans-serif'],
				mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
				sans: ['IBM Plex Mono', 'Consolas', 'monospace']
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
