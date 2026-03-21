<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Loader from '$lib/components/Loader.svelte';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
	import Header from '$lib/components/Header.svelte';
	import SkipLink from '$lib/components/SkipLink.svelte';
	import TechnicalLayout from '$lib/components/TechnicalLayout.svelte';
	import { setupIntersectionObserver } from '$lib/utils/scroll';
	import { updateActiveSection } from '$lib/stores/navigation';
	import { PRELOADER_SESSION_KEY } from '$lib/constants';
	import '../app.css';

	let { children } = $props();

	// Loading state
	let isLoading = $state(true);
	let showContent = $state(false);

	// Setup intersection observer for active section tracking
	$effect(() => {
		if (typeof window !== 'undefined' && showContent) {
			const cleanup = setupIntersectionObserver(updateActiveSection);
			return cleanup;
		}
	});

	// Session check for preloader

	function shouldShowPreloader(): boolean {
		if (typeof window === 'undefined') return false;
		return !sessionStorage.getItem(PRELOADER_SESSION_KEY);
	}

	// Check on mount if we should show the preloader
	onMount(() => {
		if (shouldShowPreloader()) {
			isLoading = true;
		} else {
			// Skip preloader, show content immediately
			isLoading = false;
			showContent = true;
		}
	});

	function handlePreloaderComplete(): void {
		isLoading = false;
		// Small delay for fade transition
		setTimeout(() => {
			showContent = true;
		}, 100);
	}
</script>

<MetaTags />
<StructuredData />

<!-- Preloader overlay -->
{#if isLoading}
	<Loader onComplete={handlePreloaderComplete} />
{/if}

<!-- Main content with fade-in -->
{#if showContent}
	<TechnicalLayout>
		<div
			class="min-h-screen bg-background"
			in:fade={{ duration: 400, delay: 50 }}
		>
			<!-- Skip to main content link for accessibility -->
			<SkipLink />

			<!-- Fixed Header -->
			<Header />

			<!-- Main content with padding-top for fixed header -->
			<main class="relative pt-16 md:pt-20">
				{@render children()}
			</main>

			<!-- Footer -->
			<footer class="footer">
				<span>© 2026 A&X LABS</span>
				<span>ENGINEERING INTEL</span>
			</footer>
		</div>
	</TechnicalLayout>
{:else}
	<TechnicalLayout>
		<div class="min-h-screen bg-background"></div>
	</TechnicalLayout>
{/if}
