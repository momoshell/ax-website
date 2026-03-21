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

<Section id="contact" class="bg-surface/30">
	<div class="max-w-5xl mx-auto">
		{#if isLoading}
			<!-- Loading skeleton -->
			<div class="h-16 w-48 mb-16 animate-pulse bg-surface"></div>
			<div class="flex gap-16">
				<div class="flex-1 space-y-6">
					<div class="h-16 bg-surface"></div>
					<div class="h-16 bg-surface"></div>
				</div>
				<div class="flex-1 space-y-4">
					<div class="h-6 bg-surface w-24"></div>
					<div class="h-12 bg-surface"></div>
					<div class="h-12 bg-surface"></div>
					<div class="h-12 bg-surface"></div>
				</div>
			</div>
		{:else if error}
			<p class="text-white/60 font-mono text-center">UNABLE TO LOAD CONTACT DATA</p>
		{:else if content}
			<ScrollReveal>
				<!-- Section header -->
				<div class="mb-16">
					<SlashHeading text="CONTACT" />
				</div>
				
				<!-- Two-column layout -->
				<div class="flex flex-col md:flex-row gap-16 md:gap-24">
					<!-- Left column - Form style inputs -->
					<div class="flex-1">
						<div class="space-y-10">
							<div>
								<p class="tech-label block mb-3">EMAIL</p>
								<div class="border-b border-white/40 py-3">
									<span class="text-white font-mono text-sm">{content.email}</span>
								</div>
							</div>
							
							<div>
								<p class="tech-label block mb-3">WORK DETAILS</p>
								<div class="border-b border-white/40 py-3">
									<span class="text-white/40 font-mono text-sm">[INQUIRY DETAILS...]</span>
								</div>
							</div>
						</div>
					</div>
					
					<!-- Right column - Contact links -->
					<div class="flex-1">
						<p class="tech-label mb-6">CONTACTS</p>
						
						<div class="space-y-6">
							<!-- Email -->
							<a 
								href="mailto:{content.email}"
								class="group block"
							>
								<p class="tech-label text-xs mb-1">EMAIL</p>
								<p class="text-white font-mono text-sm group-hover:text-white/80 transition-colors">
									{content.email} ↗
								</p>
							</a>
							
							<!-- LinkedIn -->
							<a 
								href={content.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								class="group block"
							>
								<p class="tech-label text-xs mb-1">LINKEDIN</p>
								<p class="text-white font-mono text-sm group-hover:text-white/80 transition-colors">
									@axlabs ↗
								</p>
							</a>
							
							<!-- GitHub -->
							<a 
								href={content.github}
								target="_blank"
								rel="noopener noreferrer"
								class="group block"
							>
								<p class="tech-label text-xs mb-1">GITHUB</p>
								<p class="text-white font-mono text-sm group-hover:text-white/80 transition-colors">
									@axlabs ↗
								</p>
							</a>
							
							<!-- Location -->
							<div class="block">
								<p class="tech-label text-xs mb-1">LOCATION</p>
								<p class="text-white font-mono text-sm">{content.location}</p>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Body text -->
				{#if content.body}
					<div class="mt-16 max-w-2xl">
						<p class="text-white/60 font-mono text-sm leading-relaxed">
							{content.body}
						</p>
					</div>
				{/if}
			</ScrollReveal>
		{/if}
	</div>
</Section>
