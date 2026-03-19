/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
	theme: {
		extend: {
			colors: {
				background: '#0a0a0a',
				surface: '#141414',
				'text-primary': '#fafafa',
				'text-secondary': '#737373',
				accent: '#3b82f6'
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
				sans: ['Inter', 'system-ui', 'sans-serif']
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
				'grid-pattern': 'linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)'
			},
			backgroundSize: {
				'grid': '50px 50px'
			}
		}
	},
	plugins: []
};
