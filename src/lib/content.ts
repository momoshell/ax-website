import type { HeroContent, ServicesContent, AboutContent, ContactContent } from './types';

interface MarkdownModule {
	default: unknown;
	metadata: Record<string, unknown>;
}

interface RawMarkdownModule {
	default: string;
}

/**
 * Extracts the markdown body content after the frontmatter block.
 */
function extractBody(raw: string): string {
	const frontmatterRegex = /^---\n[\s\S]*?\n---\n?/;
	const body = raw.replace(frontmatterRegex, '');
	return body.trim();
}

/**
 * Loads markdown content from the content directory.
 * Uses Vite's import.meta.glob for dynamic imports.
 * Returns parsed frontmatter metadata from mdsvex and the markdown body.
 */
export async function loadContent(section: string): Promise<
	| (HeroContent & { body: string })
	| (ServicesContent & { body: string })
	| (AboutContent & { body: string })
	| (ContactContent & { body: string })
> {
	// Get the metadata from mdsvex-processed modules (frontmatter is parsed by mdsvex)
	const modules = import.meta.glob<MarkdownModule>('/content/*.md', { eager: true });
	const path = `/content/${section}.md`;

	if (!modules[path]) {
		throw new Error(`Content not found: ${section}`);
	}

	const module = modules[path];
	const metadata = module.metadata;

	// Get the raw markdown content for the body
	const rawModules = import.meta.glob<RawMarkdownModule>('/content/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const rawPath = `/content/${section}.md?raw`;
	const rawContent = rawModules[rawPath] || rawModules[path];

	let body = '';
	if (typeof rawContent === 'string') {
		body = extractBody(rawContent);
	}

	return {
		...metadata,
		body
	} as HeroContent & { body: string };
}

/**
 * Loads a specific content file by section name.
 * Returns both metadata (frontmatter) and the compiled mdsvex component.
 */
export async function loadContentWithBody(section: string): Promise<{
	metadata: Record<string, unknown>;
	component: unknown;
}> {
	const modules = import.meta.glob<MarkdownModule>('/content/*.md', { eager: true });
	const path = `/content/${section}.md`;

	if (!modules[path]) {
		throw new Error(`Content not found: ${section}`);
	}

	const module = modules[path];

	return {
		metadata: module.metadata,
		component: module.default
	};
}
