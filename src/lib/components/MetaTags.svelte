<script lang="ts">
	import { defaultMeta, siteConfig } from '$lib/config/seo';

	interface Props {
		title?: string;
		description?: string;
		ogImage?: string;
		canonical?: string;
	}

	let {
		title = defaultMeta.title,
		description = defaultMeta.description,
		ogImage = siteConfig.ogImage,
		canonical = siteConfig.url
	}: Props = $props();
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonical} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={ogImage} />

	<!-- Canonical URL -->
	<link rel="canonical" href={canonical} />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="author" content="A&X Labs" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>
