<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import SlashHeading from '$lib/components/SlashHeading.svelte';
	import { loadContent } from '$lib/content';
	import type { ContactContent } from '$lib/types';

	let content = $state<ContactContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadContent('contact')
			.then((data) => {
				content = data as ContactContent;
				isLoading = false;
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load contact content';
				isLoading = false;
			});
	});
</script>

<Section id="contact" class="bg-surface/30 py-24">
	<div class="max-w-6xl mx-auto px-6">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="split-layout mb-16">
				<div>
					<div class="section-label mb-4 w-24 h-3 bg-surface animate-pulse"></div>
					<div class="section-heading w-48 h-12 bg-surface animate-pulse"></div>
				</div>
			</div>
			<div class="split-layout">
				<div class="space-y-6">
					<div class="h-16 bg-surface"></div>
					<div class="h-16 bg-surface"></div>
				</div>
				<div class="space-y-6">
					<div class="h-6 bg-surface w-24"></div>
					<div class="h-12 bg-surface"></div>
					<div class="h-12 bg-surface"></div>
					<div class="h-12 bg-surface"></div>
				</div>
			</div>
		{:else if error}
			<p class="body-text font-mono text-center">UNABLE TO LOAD CONTACT DATA</p>
		{:else if content}
			<ScrollReveal>
				<!-- Split layout header -->
				<div class="split-layout mb-16">
					<div>
						<p class="section-label mb-4">Contact</p>
						<h2 class="section-heading">
							GET IN TOUCH
						</h2>
					</div>
				</div>
				
				<!-- Two-column layout with split style -->
				<div class="split-layout">
					<!-- Left column - Email -->
					<div>
						<p class="section-label mb-6">EMAIL</p>
						<a 
							href="mailto:{content.email}"
							class="group block mb-8"
						>
							<span class="text-white font-mono text-lg group-hover:text-accent transition-colors">
								{content.email}
							</span>
						</a>
					</div>
					
					<!-- Right column - Contact links -->
					<div>
						<p class="section-label mb-6">CONTACTS</p>
						
						<div class="space-y-8">
							<!-- LinkedIn -->
							<a 
								href={content.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								class="group block horizontal-divider pb-6"
							>
								<p class="section-label mb-2">LINKEDIN</p>
								<p class="text-white font-mono group-hover:text-accent transition-colors">
									@axlabs ↗
								</p>
							</a>
							
							<!-- GitHub -->
							<a 
								href={content.github}
								target="_blank"
								rel="noopener noreferrer"
								class="group block horizontal-divider pb-6"
							>
								<p class="section-label mb-2">GITHUB</p>
								<p class="text-white font-mono group-hover:text-accent transition-colors">
									@axlabs ↗
								</p>
							</a>
							
							<!-- Location -->
							<div class="horizontal-divider pb-6">
								<p class="section-label mb-2">LOCATION</p>
								<p class="text-white font-mono">{content.location}</p>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Body text -->
				{#if content.body}
					<div class="split-layout mt-16">
						<div></div>
						<div>
							<p class="body-text text-lg leading-relaxed max-w-2xl">
								{content.body}
							</p>
						</div>
					</div>
				{/if}
			</ScrollReveal>
		{/if}
	</div>
</Section>
