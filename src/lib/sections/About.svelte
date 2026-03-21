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

<Section id="about" class="py-24">
	<div class="max-w-6xl mx-auto px-6">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="split-layout">
				<div>
					<div class="section-label mb-4 w-24 h-3 bg-surface animate-pulse"></div>
					<div class="section-heading w-40 h-12 bg-surface animate-pulse"></div>
				</div>
				<div class="space-y-6">
					<div class="h-5 bg-surface w-full animate-pulse"></div>
					<div class="h-5 bg-surface w-full animate-pulse"></div>
					<div class="h-5 bg-surface w-2/3 animate-pulse"></div>
				</div>
			</div>
		{:else if error}
			<p class="body-text text-center">Unable to load about content</p>
		{:else if content}
			<ScrollReveal>
				<div class="split-layout">
					<!-- Left column: Section header - sticky on desktop -->
					<div class="lg:sticky lg:top-8">
						<p class="section-label mb-4">About</p>
						<h2 class="section-heading mb-6">
							{content.title}
						</h2>
						<!-- Decorative accent line -->
						<div class="w-12 h-px bg-white/20"></div>
					</div>
					
					<!-- Right column: Content -->
					<div>
						<p class="section-label mb-6">{content.subtitle}</p>
						{#if content.body}
							<div class="space-y-6">
								{#each content.body.split('\n\n').filter(Boolean) as paragraph, i (i)}
									<p class="body-text text-lg leading-relaxed">{paragraph}</p>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</ScrollReveal>
		{/if}
	</div>
</Section>
