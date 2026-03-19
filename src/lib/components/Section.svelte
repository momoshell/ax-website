<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		class?: string;
		children: Snippet;
	}

	let { id, class: className = '', children }: Props = $props();
</script>

<section {id} class="py-20 md:py-28 lg:py-32 {className}">
	<div class="container mx-auto px-4 md:px-6 lg:px-8">
		{@render children()}
	</div>
</section>
