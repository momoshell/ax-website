<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/utils/scroll';

	interface Props {
		visible: boolean;
	}

	let { visible = false }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame: number | null = null;
	let drops: number[] = [];
	let cols = $state(0);
	let columnWidth = 11;

	function resize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		cols = Math.floor(canvas.width / columnWidth);
		drops = Array.from({ length: cols }, () => Math.random() * -80);
	}

	function draw() {
		if (!ctx || !canvas) return;

		// Trail effect - semi-transparent overlay (more subtle)
		ctx.fillStyle = 'rgba(5, 5, 8, 0.06)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Set font
		ctx.font = '15px "IBM Plex Mono", monospace';

		for (let i = 0; i < cols; i++) {
			// Random character
			const char = Math.random() > 0.5 ? '1' : '0';
			const alpha = 0.15 + Math.random() * 0.25;

			ctx.fillStyle = `rgba(200, 210, 230, ${alpha})`;
			ctx.fillText(char, i * columnWidth, drops[i] * 15);

			// Reset drop when it goes off screen (with low probability)
			if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
				drops[i] = 0;
			}

			// Increment drop position with random speed (0.3-0.5)
			drops[i] += 0.3 + Math.random() * 0.2;
		}
	}

	function animate() {
		draw();
		animationFrame = requestAnimationFrame(animate);
	}

	function stopAnimation() {
		if (animationFrame !== null) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	}

	onMount(() => {
		if (prefersReducedMotion()) {
			return;
		}

		ctx = canvas.getContext('2d');
		resize();
		animationFrame = requestAnimationFrame(animate);

		window.addEventListener('resize', resize);

		return () => {
			stopAnimation();
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="binary-rain"
	class:visible
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
		opacity: 0.15;
	}
</style>
