<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();

	let dateValue = $state('--/--/----');
	let timeValue = $state('--:--:--');

	onMount(() => {
		function updateDateTime() {
			const now = new Date();
			const day = String(now.getDate()).padStart(2, '0');
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const year = now.getFullYear();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			
			dateValue = `${day}/${month}/${year}`;
			timeValue = `${hours}:${minutes}:${seconds}`;
		}

		updateDateTime();
		const interval = setInterval(updateDateTime, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="hud-card hud-card-bottom" class:visible>
	<div class="hud-grid">
		<div class="cell cell-morph">
			<svg class="morph-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:rgba(255,255,255,0.15)" />
						<stop offset="100%" style="stop-color:rgba(255,255,255,0.02)" />
					</linearGradient>
				</defs>
				<polygon 
					points="30,5 55,20 55,45 30,55 5,40 5,15" 
					fill="url(#morphGradient)" 
					stroke="rgba(255,255,255,0.15)" 
					stroke-width="0.5"
				/>
				<polygon 
					points="30,12 48,22 48,42 30,50 12,37 12,18" 
					fill="none" 
					stroke="rgba(255,255,255,0.08)" 
					stroke-width="0.5"
				/>
			</svg>
			<div class="morph-info">
				<div class="barcode-placeholder">
					<div class="barcode-lines">
						{#each Array(19) as _, i (i)}
							<div 
								class="barcode-line" 
								style="height: {20 + (i % 3) * 6}px; opacity: {0.1 + (i % 4) * 0.05};"
							></div>
						{/each}
					</div>
				</div>
				<div class="brand-label">A&X LABS</div>
			</div>
		</div>
		<div class="cell">
			<div class="cell-label">TRADEMARK <span class="slashes">///////////////</span></div>
			<div class="cell-value">A&X.LABS.ENGINEERING</div>
		</div>
		<div class="cell">
			<div class="cell-label">DATE <span class="slashes">////////////////</span></div>
			<div class="cell-value cell-value-lg">{dateValue}</div>
		</div>
		<div class="cell">
			<div class="cell-label">DESIGNER <span class="slashes">///////////////</span></div>
			<div class="cell-value">INTEL TSCAVE</div>
		</div>
		<div class="cell">
			<div class="cell-label">TIME <span class="slashes">/////////////////</span></div>
			<div class="cell-value cell-value-lg">{timeValue}</div>
		</div>
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
		transform: translateX(-50%) translateY(0);
	}

	.hud-card-bottom {
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%) translateY(10px);
		min-width: min(620px, 88vw);
	}

	.hud-grid {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0;
	}

	.cell {
		padding: 6px 14px;
		border-right: 1px solid rgba(255, 255, 255, 0.05);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.cell:last-child {
		border-right: none;
	}

	.cell-morph {
		grid-row: 1 / 3;
		display: flex;
		align-items: center;
		gap: 14px;
		border-right: 1px solid rgba(255, 255, 255, 0.05);
	}

	.morph-shape {
		width: 60px;
		height: 60px;
		flex-shrink: 0;
	}

	.morph-info {
		display: flex;
		flex-direction: column;
	}

	.barcode-placeholder {
		background: rgba(255, 255, 255, 0.02);
		padding: 4px 6px;
	}

	.barcode-lines {
		display: flex;
		gap: 2px;
		align-items: flex-end;
		height: 28px;
	}

	.barcode-line {
		width: 2px;
		background: rgba(255, 255, 255, 0.6);
	}

	.brand-label {
		font-size: 0.55rem;
		letter-spacing: 0.25em;
		color: var(--color-dim, #666);
		margin-top: 6px;
		font-family: 'IBM Plex Mono', monospace;
	}

	.cell-label {
		font-size: 0.38rem;
		letter-spacing: 0.4em;
		color: var(--color-dim, #666);
		margin-bottom: 3px;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.cell-label .slashes {
		font-size: 0.35rem;
		color: rgba(255, 255, 255, 0.07);
		letter-spacing: 0.05em;
	}

	.cell-value {
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		color: var(--color-white, #fff);
		font-weight: 500;
	}

	.cell-value-lg {
		font-size: 0.75rem;
		font-weight: 600;
	}

	/* Responsive */
	@media (max-width: 767px) {
		.hud-card-bottom {
			display: none;
		}
	}
</style>
