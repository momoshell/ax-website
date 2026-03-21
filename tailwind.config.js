/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
	theme: {
		extend: {
			colors: {
				background: '#000000',
				surface: '#0a0a0a',
				'text-primary': '#ffffff',
				'text-secondary': '#666666'
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'Space Mono', 'Fira Code', 'Consolas', 'monospace'],
				sans: ['JetBrains Mono', 'Space Mono', 'Fira Code', 'Consolas', 'monospace']
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
