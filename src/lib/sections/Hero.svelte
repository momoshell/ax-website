<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import { loadContent } from '$lib/content';
	import type { HeroContent } from '$lib/types';

	let content = $state<HeroContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadContent('hero')
			.then((data) => {
				content = data as HeroContent;
				isLoading = false;
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load hero content';
				isLoading = false;
			});
	});

	function scrollToSection(target: string): void {
		const element = document.getElementById(target);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<Section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden">
	<!-- Background gradient effect -->
	<div class="absolute inset-0 bg-gradient-to-b from-background via-background to-surface/50 pointer-events-none"></div>
	
	<!-- Subtle grid pattern -->
	<div class="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none"></div>
	
	<!-- Main content -->
	<div class="relative z-10 text-center max-w-4xl mx-auto">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="space-y-6 animate-pulse">
				<div class="h-20 md:h-28 lg:h-36 bg-surface rounded-sm w-80 md:w-96 lg:w-[600px] mx-auto"></div>
				<div class="h-10 bg-surface rounded-sm w-64 md:w-80 mx-auto"></div>
				<div class="h-8 bg-surface rounded-sm w-48 md:w-64 mx-auto"></div>
			</div>
		{:else if error}
			<p class="text-muted-foreground">Unable to load content</p>
		{:else if content}
			<!-- Headline -->
			<h1 class="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
				{content.headline}
			</h1>
			
			<!-- Tagline -->
			<p class="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
				{content.tagline}
			</p>
			
			<!-- Subtagline -->
			<p class="text-lg text-muted-foreground/80 mb-12">
				{content.subtagline}
			</p>
			
			<!-- CTA Button -->
			<button
				onclick={() => scrollToSection(content?.cta_target || 'services')}
				class="inline-flex items-center gap-3 px-8 py-4 bg-surface border border-border/20 text-foreground font-semibold rounded-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10 group"
			>
				<span>{content.cta_text}</span>
				<svg 
					class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
					fill="none" 
					stroke="currentColor" 
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
				</svg>
			</button>
			
			<!-- Optional body text -->
			{#if content.body}
				<p class="mt-16 text-lg text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
					{content.body}
				</p>
			{/if}
		{/if}
	</div>
	
	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
		<svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</Section>
