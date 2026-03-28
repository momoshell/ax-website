<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { setupCanvas, createAnimationLoop } from '$lib/utils/canvas';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		if (!browser || !canvas) return;

		const ctx = setupCanvas(canvas);
		if (!ctx) return;

		const W = canvas.width;
		const H = canvas.height;
		const BAR_COUNT = 35;

		interface Bar {
			baseW: number;
			phase: number;
			speed: number;
			x: number;
		}

		const bars: Bar[] = Array.from({ length: BAR_COUNT }, () => ({
			baseW: Math.random() > 0.5 ? Math.random() * 4 + 2 : Math.random() * 2 + 0.8,
			phase: Math.random() * Math.PI * 2,
			speed: 0.4 + Math.random() * 0.8,
			x: 0
		}));

		let xPos = 0;
		bars.forEach(b => {
			b.x = xPos;
			xPos += b.baseW + 1.5;
		});

		const scale = W / xPos;

		const anim = createAnimationLoop(() => {
			ctx.clearRect(0, 0, W, H);
			const t = performance.now() * 0.001;
			bars.forEach(b => {
				const wave = Math.sin(t * b.speed + b.phase);
				const w = Math.max(0.5, b.baseW + wave * 1.8) * scale;
				const x = b.x * scale;
				const alpha = 0.3 + (wave * 0.5 + 0.5) * 0.35;
				ctx.fillStyle = `rgba(232,230,227,${alpha})`;
				ctx.fillRect(x, 0, w, H);
			});
		});

		anim.start();

		return () => {
			anim.stop();
		};
	});
</script>

<canvas 
	bind:this={canvas}
	class="barcode-canvas"
	width="130" 
	height="28"
	aria-label="Animated barcode visualization"
></canvas>

<style>
	.barcode-canvas {
		display: block;
		height: 28px;
		width: auto;
	}
</style>
