import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx']
		})
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore missing og-image.jpg - it's optional for social sharing
				if (path === '/og-image.jpg') {
					return;
				}
				// Throw other HTTP errors
				throw new Error(message);
			}
		}
	}
};

export default config;
