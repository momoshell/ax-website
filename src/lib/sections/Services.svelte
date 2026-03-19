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

<Section id="services" class="bg-surface/30">
	<div class="max-w-6xl mx-auto">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="text-center mb-16">
				<div class="h-12 bg-surface rounded-sm w-48 mx-auto mb-4 animate-pulse"></div>
				<div class="h-6 bg-surface rounded-sm w-32 mx-auto animate-pulse"></div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		{#each Array(4) as _, i (i)}
				<div class="bg-surface p-6 rounded-sm h-48 animate-pulse"></div>
			{/each}
			</div>
		{:else if error}
			<p class="text-muted-foreground text-center">Unable to load services</p>
		{:else if content}
			<!-- Section header -->
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
					{content.title}
				</h2>
				<p class="text-xl text-muted-foreground">
					{content.subtitle}
				</p>
			</div>
			
			<!-- Services grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each content.services as service, index (service.title)}
					<ScrollReveal delay={index * 100}>
						<div 
							class="group bg-surface p-6 rounded-sm border border-border/10 hover:border-accent/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 h-full"
						>
							<!-- Icon -->
							<div class="w-12 h-12 bg-background rounded-sm flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors duration-300">
								<svg 
									class="w-6 h-6 text-accent" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path 
										stroke-linecap="round" 
										stroke-linejoin="round" 
										stroke-width="1.5" 
										d={getIconPath(service.icon)}
									></path>
								</svg>
							</div>
							
							<!-- Title -->
							<h3 class="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
								{service.title}
							</h3>
							
							<!-- Description -->
							<p class="text-muted-foreground leading-relaxed">
								{service.description}
							</p>
						</div>
					</ScrollReveal>
				{/each}
			</div>
		{/if}
	</div>
</Section>
