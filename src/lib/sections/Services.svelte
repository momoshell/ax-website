<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { loadContent } from '$lib/content';
	import type { ServicesContent, Service } from '$lib/types';

	let content = $state<ServicesContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadContent('services')
			.then((data) => {
				content = data as ServicesContent;
				isLoading = false;
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load services content';
				isLoading = false;
			});
	});

	// Icon components as simple SVG paths
	const iconPaths: Record<string, string> = {
		brain: 'M12 2a4 4 0 0 1 4 4c0 1.1-.45 2.1-1.17 2.83L12 12l-2.83-3.17A4 4 0 0 1 8 6a4 4 0 0 1 4-4zm0 10c3.31 0 6 2.69 6 6v1H6v-1c0-3.31 2.69-6 6-6zm-4 4c0-2.21 1.79-4 4-4s4 1.79 4 4H8z',
		cpu: 'M9 3v2H7a2 2 0 0 0-2 2v2h2V7h2V5H9V3zm6 0v2h2a2 2 0 0 1 2 2v2h-2V9h-2v2h2v2h-2v-2h-2V9h2V7h2V5h-2zm-6 6v8h2v2H7a2 2 0 0 1-2-2v-2h2v2h2v-2H9v-2h2v-2H9zm6 0v2h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2h2zM9 13v2h6v-2H9z',
		layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
		compass: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 0a14.002 14.002 0 0 1-8.123-2.683M12 2a14.002 14.002 0 0 1 8.123 2.683'
	};

	function getIconPath(icon: string): string {
		return iconPaths[icon] || iconPaths.brain;
	}
</script>

<Section id="services" class="bg-surface/30 py-24">
	<div class="max-w-6xl mx-auto px-6">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="split-layout mb-16">
				<div>
					<div class="section-label mb-4 w-24 h-3 bg-surface animate-pulse"></div>
					<div class="section-heading w-48 h-12 bg-surface animate-pulse"></div>
				</div>
				<div class="space-y-8">
					{#each Array(4) as _, i (i)}
						<div class="horizontal-divider pt-8 pb-8">
							<div class="h-6 bg-surface w-32 mb-4 animate-pulse"></div>
							<div class="h-4 bg-surface w-full mb-2 animate-pulse"></div>
							<div class="h-4 bg-surface w-3/4 animate-pulse"></div>
						</div>
					{/each}
				</div>
			</div>
		{:else if error}
			<p class="body-text text-center">Unable to load services</p>
		{:else if content}
			<!-- Split layout header -->
			<div class="split-layout mb-16">
				<div>
					<p class="section-label mb-4">Services</p>
					<h2 class="section-heading">
						{content.title}
					</h2>
				</div>
				<p class="body-text text-lg self-end">
					{content.subtitle}
				</p>
			</div>
			
			<!-- Services list with horizontal dividers -->
			<div class="space-y-0">
				{#each content.services as service, index (service.title)}
					<ScrollReveal delay={index * 100}>
						<div class="service-card group">
							<div class="split-layout">
								<!-- Service title -->
								<h3 class="service-title group-hover:text-accent transition-colors duration-300">
									{service.title}
								</h3>
								
								<!-- Service description -->
								<p class="service-description">
									{service.description}
								</p>
							</div>
						</div>
					</ScrollReveal>
				{/each}
			</div>
		{/if}
	</div>
</Section>
