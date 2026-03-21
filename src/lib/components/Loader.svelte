<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		onComplete?: () => void;
	}

	let { onComplete }: Props = $props();

	let progress = $state(0);
	let currentLabel = $state('INITIALIZING');
	let isDone = $state(false);

	const labels = ['INITIALIZING', 'LOADING NODES', 'MAPPING GRID', 'CALIBRATING', 'SYNCING', 'READY'];

	function ease(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function updateProgress() {
		progress += Math.random() * 2.5 + 0.5;
		if (progress > 100) progress = 100;
		
		currentLabel = labels[Math.min(Math.floor(progress / 20), labels.length - 1)];
		
		if (progress < 100) {
			setTimeout(updateProgress, 35 + Math.random() * 55);
		} else {
			setTimeout(startReveal, 350);
		}
	}

	async function startReveal() {
		isDone = true;
		
		// Wait for exit animation
		await new Promise(r => setTimeout(r, 700));
		
		if (onComplete) {
			onComplete();
		}
	}

	onMount(() => {
		setTimeout(updateProgress, 250);
	});
</script>

{#if !isDone}
	<div class="loader" class:done={isDone}>
		<div class="loader-card">
			<div class="lc-tick-l"></div>
			<div class="lc-tick-r"></div>
			<div class="loader-header">
				SYSTEM <span style="margin-left:6px;letter-spacing:0.08em;color:rgba(255,255,255,0.08)">//////////////////////</span>
			</div>
			<div class="loader-percent">{String(Math.floor(progress)).padStart(3, '0')}</div>
			<div class="loader-bar-track">
				<div class="loader-bar-fill" style="width: {progress}%"></div>
			</div>
			<div class="loader-label">{currentLabel}</div>
			<div class="loader-slashes">////////////////////////////////////</div>
		</div>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

	.loader {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: #050508;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: opacity 0.7s ease, visibility 0.7s ease;
	}

	.loader.done {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.loader-card {
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 28px 40px;
		position: relative;
		min-width: 280px;
		text-align: center;
		background: #050508;
	}

	.loader-card::before,
	.loader-card::after {
		content: '';
		position: absolute;
		background: #e8e6e3;
	}

	.loader-card::before {
		top: -6px;
		left: 50%;
		width: 1px;
		height: 12px;
	}

	.loader-card::after {
		bottom: -6px;
		left: 50%;
		width: 1px;
		height: 12px;
	}

	.lc-tick-l,
	.lc-tick-r {
		position: absolute;
		background: #e8e6e3;
	}

	.lc-tick-l {
		left: -6px;
		top: 50%;
		width: 12px;
		height: 1px;
	}

	.lc-tick-r {
		right: -6px;
		top: 50%;
		width: 12px;
		height: 1px;
	}

	.loader-header {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.5rem;
		letter-spacing: 0.5em;
		color: #55555e;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		padding-bottom: 12px;
		margin-bottom: 16px;
	}

	.loader-bar-track {
		width: 100%;
		height: 2px;
		background: rgba(255, 255, 255, 0.06);
		position: relative;
		overflow: hidden;
		margin-top: 16px;
	}

	.loader-bar-fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 0%;
		background: #e8e6e3;
		transition: width 0.12s linear;
		box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
	}

	.loader-percent {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 2rem;
		font-weight: 300;
		letter-spacing: 0.15em;
		color: #e8e6e3;
		margin-top: 8px;
	}

	.loader-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.5rem;
		letter-spacing: 0.5em;
		color: rgba(255, 255, 255, 0.18);
		margin-top: 12px;
	}

	.loader-slashes {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.45rem;
		color: rgba(255, 255, 255, 0.08);
		letter-spacing: 0.15em;
		margin-top: 8px;
	}
</style>
