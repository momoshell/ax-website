<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import NavLink from './NavLink.svelte';
	import { scrollToSection, scrollToTop } from '$lib/utils/scroll';
	import { activeSection } from '$lib/stores/navigation';

	// Mobile menu state
	let isMobileMenuOpen = $state(false);

	// Navigation links
	const navLinks = [
		{ id: 'services', label: 'Services' },
		{ id: 'about', label: 'About' },
		{ id: 'contact', label: 'Contact' }
	];

	function handleNavClick(sectionId: string) {
		if (sectionId === 'hero') {
			scrollToTop();
		} else {
			scrollToSection(sectionId);
		}
		isMobileMenuOpen = false;
	}

	function handleLogoClick() {
		scrollToTop();
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	function handleBackdropClick() {
		isMobileMenuOpen = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="fixed top-0 left-0 right-0 z-40 h-16 md:h-20 bg-background/80 backdrop-blur-md border-b border-border/10">
	<nav class="container mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between" aria-label="Main navigation">
		<!-- Logo -->
		<a
			href="#hero"
			onclick={(e) => {
				e.preventDefault();
				handleLogoClick();
			}}
			class="font-mono font-bold text-lg text-accent hover:text-accent/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
		>
			A&X LABS
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden md:flex items-center gap-8">
			{#each navLinks as link (link.id)}
				<NavLink
					href="#{link.id}"
					label={link.label}
					isActive={$activeSection === link.id}
					onclick={() => handleNavClick(link.id)}
				/>
			{/each}
		</div>

		<!-- Mobile Menu Button -->
		<button
			type="button"
			class="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
			onclick={toggleMobileMenu}
			aria-expanded={isMobileMenuOpen}
			aria-controls="mobile-menu"
			aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
		>
			{#if isMobileMenuOpen}
				<!-- Close icon -->
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{:else}
				<!-- Hamburger icon -->
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			{/if}
		</button>
	</nav>
</header>

<!-- Mobile Menu Overlay -->
{#if isMobileMenuOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		aria-hidden="true"
		inert
	></div>

	<!-- Mobile Menu Drawer -->
	<div
		id="mobile-menu"
		class="fixed top-0 right-0 z-50 w-80 max-w-full h-full bg-surface border-l border-border/10 md:hidden"
		transition:slide={{ duration: 300, axis: 'x' }}
	>
		<div class="flex flex-col h-full">
			<!-- Mobile Menu Header -->
			<div class="flex items-center justify-between h-16 md:h-20 px-4 border-b border-border/10">
				<span class="font-mono font-bold text-lg text-accent">A&X LABS</span>
				<button
					type="button"
					class="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
					onclick={() => (isMobileMenuOpen = false)}
					aria-label="Close menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Mobile Menu Links -->
			<nav class="flex-1 overflow-y-auto" aria-label="Mobile navigation">
				<ul class="py-4">
					<!-- Hero Link -->
					<li>
						<a
							href="#hero"
							onclick={(e) => {
								e.preventDefault();
								handleNavClick('hero');
							}}
							class="block px-6 py-4 text-lg font-medium border-b border-border/10 transition-colors duration-200 focus-visible:outline-none focus-visible:bg-surface/50"
							class:text-accent={$activeSection === 'hero'}
							class:text-muted-foreground={$activeSection !== 'hero'}
							class:hover:text-foreground={$activeSection !== 'hero'}
						>
							Home
						</a>
					</li>
					{#each navLinks as link (link.id)}
						<li>
							<a
								href="#{link.id}"
								onclick={(e) => {
									e.preventDefault();
									handleNavClick(link.id);
								}}
								class="block px-6 py-4 text-lg font-medium border-b border-border/10 transition-colors duration-200 focus-visible:outline-none focus-visible:bg-surface/50"
								class:text-accent={$activeSection === link.id}
								class:text-muted-foreground={$activeSection !== link.id}
								class:hover:text-foreground={$activeSection !== link.id}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
{/if}
