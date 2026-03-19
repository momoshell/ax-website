<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		delay?: number;
	}

	let { children, class: className = '', delay = 0 }: Props = $props();

	let element: HTMLDivElement;
	let isVisible = $state(false);

	onMount(() => {
		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		
		if (prefersReducedMotion) {
			isVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		if (element) observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="transition-all duration-700 ease-out {className}"
	class:opacity-0={!isVisible}
	class:opacity-100={isVisible}
	class:translate-y-6={!isVisible}
	class:translate-y-0={isVisible}
	style="transition-delay: {delay}ms"
>
	{@render children()}
</div>
