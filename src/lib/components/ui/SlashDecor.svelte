<script lang="ts">
	interface Props {
		/** Number of slash characters to render */
		count?: number;
		/** Additional CSS class for styling */
		class?: string;
	}

	let { count = 20, class: className = '' }: Props = $props();

	const slashes = $derived('/'.repeat(count));
</script>

<span class="slash-decor {className}" aria-hidden="true">{slashes}</span>

<style>
	.slash-decor {
		font-size: 0.38rem;
		color: rgba(255, 255, 255, 0.08);
		letter-spacing: 0.05em;
		overflow: hidden;
		white-space: nowrap;
		font-family: 'IBM Plex Mono', monospace;
	}
</style>
