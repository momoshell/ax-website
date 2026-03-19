<script lang="ts">
	import { siteConfig } from '$lib/config/seo';

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'hello@axlabs.ai',
			contactType: 'customer service'
		}
	};
</script>

<svelte:head>
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>
