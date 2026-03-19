<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { loadContent } from '$lib/content';
	import type { AboutContent } from '$lib/types';

	let content = $state<AboutContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadContent('about')
			.then((data) => {
				content = data as AboutContent;
				isLoading = false;
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load about content';
				isLoading = false;
			});
	});
</script>

<Section id="about">
	<div class="max-w-6xl mx-auto">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
				<div>
					<div class="h-12 bg-surface rounded-sm w-32 mb-4 animate-pulse"></div>
					<div class="h-8 bg-surface rounded-sm w-24 animate-pulse"></div>
				</div>
				<div class="space-y-4">
					<div class="h-6 bg-surface rounded-sm w-full animate-pulse"></div>
					<div class="h-6 bg-surface rounded-sm w-full animate-pulse"></div>
					<div class="h-6 bg-surface rounded-sm w-3/4 animate-pulse"></div>
				</div>
			</div>
		{:else if error}
			<p class="text-muted-foreground text-center">Unable to load about content</p>
		{:else if content}
			<ScrollReveal>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
					<!-- Left column: Section header -->
					<div class="lg:sticky lg:top-8">
						<h2 class="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
							{content.title}
						</h2>
						<p class="text-xl text-muted-foreground">
							{content.subtitle}
						</p>
						
						<!-- Decorative accent line -->
						<div class="mt-8 w-16 h-1 bg-accent"></div>
					</div>
					
					<!-- Right column: Content -->
					<div class="prose prose-invert prose-lg max-w-none">
						{#if content.body}
							<div class="text-lg leading-relaxed space-y-4 text-muted-foreground">
								{#each content.body.split('\n\n').filter(Boolean) as paragraph, i (i)}
									<p class="text-lg leading-relaxed">{paragraph}</p>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</ScrollReveal>
		{/if}
	</div>
</Section>
