<script lang="ts">
	import { onMount } from 'svelte';
	import { setupCanvas, createAnimationLoop, createResizeHandler, prefersReducedMotion } from '$lib/utils/canvas';

	interface Props {
		visible: boolean;
	}

	let { visible = false }: Props = $props();

	let canvas: HTMLCanvasElement;
	let drops: number[] = [];
	let cols = $state(0);
	const columnWidth = 16;

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		cols = Math.floor(canvas.width / columnWidth);
		drops = Array.from({ length: cols }, () => Math.random() * -80);
	}

	onMount(() => {
		if (prefersReducedMotion()) {
			return;
		}

		const ctx = setupCanvas(canvas);
		if (!ctx) return;

		resizeCanvas();

		const anim = createAnimationLoop(() => {
			// Trail effect - semi-transparent overlay
			ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Set font
			ctx.font = '15px "IBM Plex Mono", monospace';

			for (let i = 0; i < cols; i++) {
				// Random character
				const char = Math.random() > 0.5 ? '1' : '0';
				const alpha = 0.25 + Math.random() * 0.35;

				ctx.fillStyle = `rgba(200, 210, 230, ${alpha})`;
				ctx.fillText(char, i * columnWidth, drops[i] * 15);

				// Reset drop when it goes off screen (with low probability)
				if (drops[i] * 15 > canvas.height && Math.random() > 0.98) {
					drops[i] = 0;
				}

				// Increment drop position with slower random speed (0.15-0.3)
				drops[i] += 0.15 + Math.random() * 0.15;
			}
		});

		const resizer = createResizeHandler(resizeCanvas);
		anim.start();
		resizer.start();

		return () => {
			anim.stop();
			resizer.stop();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="binary-rain"
	class:visible
	aria-label="Falling binary code rain animation"
	style="-webkit-mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent); mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent);"
></canvas>

<style>
	.binary-rain {
		position: absolute;
		inset: 0;
		z-index: 2;
		opacity: 0;
		transition: opacity 0.8s ease-out;
		pointer-events: none;
	}

	.binary-rain.visible {
		opacity: 0.25;
	}
</style>
