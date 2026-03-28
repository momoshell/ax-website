<script lang="ts">
	import SlashDecor from '$lib/components/ui/SlashDecor.svelte';

	interface Props {
		position: 'tl' | 'tr' | 'bl' | 'br';
		label: string;
		value: string;
		slashes?: number;
		visible?: boolean;
	}

	let { position, label, value, slashes = 0, visible = false }: Props = $props();
</script>

<div class="hud-card hud-card-{position}" class:visible>
	<div class="hud-card-header">
		<span class="label">{label}</span>
		{#if slashes > 0}
			<SlashDecor count={slashes} class="slashes" />
		{/if}
	</div>
	<div class="hud-card-body">
		<div class="value">{value}</div>
	</div>
</div>

<style>
	.hud-card {
		position: absolute;
		z-index: 12;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(5, 5, 8, 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		padding: 0;
		font-family: 'IBM Plex Mono', monospace;
		pointer-events: none;
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}
	
	.hud-card.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hud-card-header {
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		padding: 6px 12px;
		gap: 8px;
	}

	.hud-card-header .label {
		font-size: 0.42rem;
		letter-spacing: 0.4em;
		color: var(--color-dim, #666);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.hud-card-header :global(.slash-decor.slashes) {
		flex: 1;
	}

	.hud-card-body {
		padding: 8px 12px 10px;
	}

	.hud-card-body .value {
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		color: var(--color-white, #fff);
		font-weight: 500;
	}

	/* Position variants */
	.hud-card-tl {
		top: 28px;
		left: 28px;
		min-width: 180px;
	}

	.hud-card-tr {
		top: 28px;
		right: 28px;
		min-width: 150px;
	}

	.hud-card-bl {
		bottom: 28px;
		left: 28px;
		min-width: 200px;
	}

	.hud-card-br {
		bottom: 28px;
		right: 28px;
		min-width: 160px;
	}

	/* Responsive - hide on mobile */
	@media (max-width: 767px) {
		.hud-card-tl,
		.hud-card-tr,
		.hud-card-bl,
		.hud-card-br {
			display: none;
		}
	}
</style>
