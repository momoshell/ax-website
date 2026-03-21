<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import SlashHeading from '$lib/components/SlashHeading.svelte';
	import Barcode from '$lib/components/Barcode.svelte';

	function scrollToSection(target: string): void {
		const element = document.getElementById(target);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<Section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
	<!-- Subtle grid pattern -->
	<div class="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none"></div>
	
	<!-- Main content - compact centered layout -->
	<div class="relative z-10 text-center max-w-3xl mx-auto px-6">
		<!-- Slash Heading -->
		<div class="mb-6">
			<SlashHeading text="A&X LABS" class="text-6xl md:text-8xl" />
		</div>
		
		<!-- Barcode -->
		<div class="mb-8">
			<Barcode value="A&X LABS" width={300} height={80} />
		</div>
		
		<!-- Simplified Tagline -->
		<p class="tech-label text-lg md:text-xl text-white/60 mb-10 tracking-widest uppercase">
			Engineering Intelligence
		</p>
		
		<!-- CTA Button - Industrial style: sharp, inverted hover -->
		<button
			onclick={() => scrollToSection('services')}
			class="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white font-mono font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-200 group"
		>
			<span class="text-sm tracking-widest uppercase">Explore Our Work</span>
			<svg 
				class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
				fill="none" 
				stroke="currentColor" 
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
			</svg>
		</button>
	</div>
</Section>
