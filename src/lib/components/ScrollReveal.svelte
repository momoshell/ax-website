<script lang="ts">
	import { onMount } from 'svelte';
	import { createScrollObserver, prefersReducedMotion } from '$lib/utils/scroll';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		delay?: number;
	}

	let { children, class: className = '', delay = 0 }: Props = $props();

	let element: HTMLDivElement;

	onMount(() => {
		// Skip animation for reduced motion preference
		if (prefersReducedMotion()) {
			if (element) element.classList.add('visible');
			return;
		}

		const scrollObserver = createScrollObserver({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

		if (element) scrollObserver.observe(element);

		return () => {
			scrollObserver.disconnect();
		};
	});
</script>

<div
	bind:this={element}
	class="sr {className}"
	style="transition-delay: {delay}ms; display: flex; align-items: center;"
>
	{@render children()}
</div>
