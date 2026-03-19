/** @type {import('mdsvex').MdsvexOptions} */
export default {
	extensions: ['.md', '.svx'],
	layout: {
		_: './src/lib/layouts/MarkdownLayout.svelte'
	},
	highlight: {
		alias: {}
	},
	smartypants: {
		dashes: 'oldschool'
	},
	remarkPlugins: [],
	rehypePlugins: []
};
