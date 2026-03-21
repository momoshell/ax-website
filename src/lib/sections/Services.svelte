<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import SpecCard from '$lib/components/SpecCard.svelte';
	import { loadContent } from '$lib/content';
	import type { ServicesContent } from '$lib/types';

	let content = $state<ServicesContent | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let rulerVisible = $state(false);

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

		// Ruler visibility observer
		let observer: IntersectionObserver | null = null;
		const ruler = document.querySelector('.ruler-bar');
		if (ruler) {
			observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						rulerVisible = true;
					}
				},
				{ threshold: 0.5 }
			);
			observer.observe(ruler);
		}

		return () => {
			if (observer) observer.disconnect();
		};
	});

	// Service data with spec card info
	const services = [
		{
			number: '01',
			codename: 'AXL-AI-DEV',
			diagramShape: 'neural' as const,
			meta: { type: 'ML / CV / NLP', status: 'ACTIVE', ref: '0xA1' }
		},
		{
			number: '02',
			codename: 'AXL-HW-INT',
			diagramShape: 'circuit' as const,
			meta: { type: 'IOT / EMBEDDED', status: 'ACTIVE', ref: '0xB2' }
		},
		{
			number: '03',
			codename: 'AXL-SYS-ARC',
			diagramShape: 'arch' as const,
			meta: { type: 'INFRA / CLOUD', status: 'ACTIVE', ref: '0xC3' }
		},
		{
			number: '04',
			codename: 'AXL-CONSULT',
			diagramShape: 'radar' as const,
			meta: { type: 'STRATEGY', status: 'ACTIVE', ref: '0xD4' }
		}
	];
</script>

<Section id="services" class="bg-surface pt-16 md:pt-20 py-24">
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
			<div class="split-layout mb-12">
				<div>
					<p class="section-label mb-4">Services</p>
					<h2 class="section-heading">{content.title}</h2>
				</div>
				<p class="body-text text-lg self-end">{content.subtitle}</p>
			</div>

			<!-- Ruler bar with tick marks -->
			<div class="ruler-bar mb-10 h-5 relative" class:visible={rulerVisible}>
				<div class="absolute inset-x-0 bottom-0 h-px bg-line-faint"></div>
				<!-- Tick marks -->
				<div class="absolute inset-x-0 bottom-0 flex justify-between px-0">
					{#each Array(21) as _, i (i)}
						<div
							class="w-px h-2 bg-line-faint"
							style="height: {i % 5 === 0 ? '8px' : '4px'}; opacity: {i % 5 === 0 ? '0.6' : '0.3'};"
						></div>
					{/each}
				</div>
			</div>

			<!-- Spec cards grid -->
			<div class="spec-grid">
				{#each content.services as service, index (service.title)}
					<div
						class="spec-card-wrapper opacity-0 translate-y-5 transition-all duration-700 ease-out"
						style="transition-delay: {300 + index * 100}ms"
						class:opacity-100={rulerVisible}
						class:translate-y-0={rulerVisible}
					>
						<SpecCard
							number={services[index].number}
							codename={services[index].codename}
							title={service.title}
							description={service.description}
							diagramShape={services[index].diagramShape}
							meta={services[index].meta}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</Section>

<style>
	/* Split layout for header */
	:global(.split-layout) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: end;
	}

	@media (max-width: 768px) {
		:global(.split-layout) {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}

	/* Spec grid layout */
	.spec-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-top: 10px;
	}

	@media (max-width: 768px) {
		.spec-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Ruler bar transition */
	.ruler-bar {
		opacity: 0;
		transition: opacity 1s ease;
	}

	.ruler-bar.visible {
		opacity: 1;
	}

	/* Section label style */
	.section-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.4em;
		color: var(--color-accent, #a78bfa);
		text-transform: uppercase;
	}

	/* Section heading style */
	.section-heading {
		font-family: 'Outfit', sans-serif;
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--color-white, #ffffff);
		line-height: 1.2;
	}

	/* Body text style */
	:global(.body-text) {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.85rem;
		line-height: 1.75;
		color: var(--color-body-text, #9ca3af);
	}

	/* Surface color for skeleton */
	:global(.bg-surface) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Line faint color */
	.bg-line-faint {
		background-color: rgba(255, 255, 255, 0.06);
	}
</style>
