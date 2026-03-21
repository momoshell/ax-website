<script lang="ts">
	import { onMount } from 'svelte';

	let scrolled = $state(false);
	let heroHeight = $state(0);

	onMount(() => {
		heroHeight = window.innerHeight * 0.7;

		function handleScroll() {
			scrolled = window.scrollY > heroHeight;
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<nav 
	class="nav" 
	class:visible={scrolled}
	aria-label="Main navigation"
>
	<a href="#hero" class="nav-logo"><span>/</span>A&X LABS</a>
	<div class="nav-links">
		<a href="#services">Services</a>
		<a href="#about">About</a>
		<a href="#contact">Contact</a>
	</div>
</nav>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-nav);
		padding: 20px var(--pad);
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: var(--font-mono);
		opacity: 0;
		transform: translateY(-10px);
		transition: opacity 0.5s ease, transform 0.5s ease, background 0.3s ease;
		pointer-events: none;
		background: transparent;
	}

	.nav.visible {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
		background: rgba(5, 5, 8, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line-faint);
	}

	.nav-logo {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		color: var(--white);
		text-decoration: none;
	}

	.nav-logo span {
		color: var(--dim);
		font-weight: 300;
	}

	.nav-links {
		display: flex;
		gap: 32px;
	}

	.nav-links a {
		font-size: 0.55rem;
		letter-spacing: 0.35em;
		color: var(--dim);
		text-decoration: none;
		text-transform: uppercase;
		transition: color 0.3s ease;
		position: relative;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--white);
		transition: width 0.3s ease;
	}

	.nav-links a:hover {
		color: var(--white);
	}

	.nav-links a:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.nav {
			padding: 16px 20px;
		}

		.nav-links {
			gap: 20px;
		}

		.nav-links a {
			font-size: 0.5rem;
		}
	}
</style>
