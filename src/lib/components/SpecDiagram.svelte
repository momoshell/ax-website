<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/utils/scroll';

	type DiagramShape = 'neural' | 'circuit' | 'arch' | 'radar';

	interface Props {
		shape: DiagramShape;
	}

	let { shape }: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;

	onMount(() => {
		if (prefersReducedMotion()) {
			return;
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const S = 136;
		const C = S / 2;

		// Neural network: layers of connected nodes
		function drawNeural(t: number) {
			const layers = [3, 5, 5, 3];
			const nodePositions: { x: number; y: number }[][] = [];

			layers.forEach((n, li) => {
				const x = 20 + (li / (layers.length - 1)) * (S - 40);
				const layerPts: { x: number; y: number }[] = [];
				for (let ni = 0; ni < n; ni++) {
					const y = C + (ni - (n - 1) / 2) * 18;
					layerPts.push({ x, y });
				}
				nodePositions.push(layerPts);
			});

			// Draw connections with animated pulse
			for (let l = 0; l < nodePositions.length - 1; l++) {
				nodePositions[l].forEach((a, ai) => {
					nodePositions[l + 1].forEach((b, bi) => {
						const pulse = Math.sin(t * 2 + l + ai * 0.5 + bi * 0.3) * 0.5 + 0.5;
						ctx!.strokeStyle = `rgba(200,210,225,${0.15 + pulse * 0.25})`;
						ctx!.lineWidth = 0.6;
						ctx!.beginPath();
						ctx!.moveTo(a.x, a.y);
						ctx!.lineTo(b.x, b.y);
						ctx!.stroke();
					});
				});
			}

			// Draw nodes
			nodePositions.forEach((layer, li) => {
				layer.forEach((p, ni) => {
					const pulse = Math.sin(t * 1.5 + li + ni) * 0.5 + 0.5;
					ctx!.beginPath();
					ctx!.arc(p.x, p.y, 2 + pulse * 1.5, 0, Math.PI * 2);
					ctx!.fillStyle = `rgba(210,218,230,${0.5 + pulse * 0.45})`;
					ctx!.fill();
				});
			});
		}

		// Circuit board: grid of connected paths
		function drawCircuit(t: number) {
			const grid = 5;
			const gap = (S - 40) / (grid - 1);

			for (let x = 0; x < grid; x++) {
				for (let y = 0; y < grid; y++) {
					const px = 20 + x * gap;
					const py = 20 + y * gap;
					const pulse = Math.sin(t * 1.2 + x * 1.3 + y * 0.8) * 0.5 + 0.5;

					// Horizontal connection
					if (x < grid - 1) {
						ctx!.strokeStyle = `rgba(200,210,225,${0.12 + pulse * 0.2})`;
						ctx!.lineWidth = 0.6;
						ctx!.beginPath();
						ctx!.moveTo(px, py);
						ctx!.lineTo(px + gap, py);
						ctx!.stroke();
					}

					// Vertical connection
					if (y < grid - 1) {
						ctx!.strokeStyle = `rgba(200,210,225,${0.12 + pulse * 0.15})`;
						ctx!.lineWidth = 0.6;
						ctx!.beginPath();
						ctx!.moveTo(px, py);
						ctx!.lineTo(px, py + gap);
						ctx!.stroke();
					}

					// Node
					const isActive = (x + y + Math.floor(t)) % 3 === 0;
					ctx!.beginPath();
					ctx!.arc(px, py, isActive ? 3 : 1.5, 0, Math.PI * 2);
					ctx!.fillStyle = `rgba(210,218,230,${isActive ? 0.85 : 0.35})`;
					ctx!.fill();
				}
			}
		}

		// Architecture: layered hexagonal structure
		function drawArch(t: number) {
			const layers = [1, 6, 12];
			const rot = t * 0.3;

			layers.forEach((n, li) => {
				const r = li * 18;
				for (let i = 0; i < n; i++) {
					const angle = (Math.PI * 2 / n) * i + rot * (li + 1) * 0.4;
					const x = C + Math.cos(angle) * r;
					const y = C + Math.sin(angle) * r;
					const pulse = Math.sin(t * 1.5 + li * 2 + i * 0.5) * 0.5 + 0.5;

					// Connect to center for inner rings
					if (li > 0) {
						ctx!.strokeStyle = `rgba(200,210,225,${0.12 + pulse * 0.18})`;
						ctx!.lineWidth = 0.6;
						ctx!.beginPath();
						ctx!.moveTo(C, C);
						ctx!.lineTo(x, y);
						ctx!.stroke();
					}

					ctx!.beginPath();
					ctx!.arc(x, y, 1.5 + pulse, 0, Math.PI * 2);
					ctx!.fillStyle = `rgba(210,218,230,${0.45 + pulse * 0.4})`;
					ctx!.fill();
				}

				// Ring
				if (r > 0) {
					ctx!.beginPath();
					ctx!.arc(C, C, r, 0, Math.PI * 2);
ctx!.strokeStyle = 'rgba(200,210,225,0.15)';
					ctx!.lineWidth = 0.6;
					ctx!.stroke();
				}
			});
		}

		// Radar / compass: rotating sweep with data points
		function drawRadar(t: number) {
			const sweepAngle = t * 0.8;

			// Concentric rings - make very prominent
			for (let r = 15; r <= 50; r += 12) {
				ctx!.beginPath();
				ctx!.arc(C, C, r, 0, Math.PI * 2);
				ctx!.strokeStyle = 'rgba(255,255,255,0.7)';
				ctx!.lineWidth = 2.5;
				ctx!.stroke();
			}

			// Cross lines - make very prominent
			ctx!.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx!.lineWidth = 2;
			ctx!.beginPath();
			ctx!.moveTo(C - 60, C);
			ctx!.lineTo(C + 60, C);
			ctx!.stroke();
			ctx!.beginPath();
			ctx!.moveTo(C, C - 60);
			ctx!.lineTo(C, C + 60);
			ctx!.stroke();

			// Sweep line - very bright
			ctx!.strokeStyle = 'rgba(255,255,255,0.95)';
			ctx!.lineWidth = 3;
			ctx!.beginPath();
			ctx!.moveTo(C, C);
			ctx!.lineTo(C + Math.cos(sweepAngle) * 55, C + Math.sin(sweepAngle) * 55);
			ctx!.stroke();

			// Data blips - big and bright
			const blips = [
				[20, 0.5],
				[35, 1.8],
				[42, 3.2],
				[28, 4.5],
				[48, 5.5]
			];
			blips.forEach(([r, aOff]) => {
				const a = aOff + t * 0.1;
				const x = C + Math.cos(a) * r;
				const y = C + Math.sin(a) * r;
				ctx!.beginPath();
				ctx!.arc(x, y, 5, 0, Math.PI * 2);
				ctx!.fillStyle = 'rgba(255,255,255,0.9)';
				ctx!.fill();
			});
		}

		function draw() {
			ctx!.clearRect(0, 0, S, S);
			const t = performance.now() * 0.001;

			ctx!.strokeStyle = 'rgba(200,210,225,0.3)';
			ctx!.fillStyle = 'rgba(200,210,225,0.5)';
			ctx!.lineWidth = 0.6;

			switch (shape) {
				case 'neural':
					drawNeural(t);
					break;
				case 'circuit':
					drawCircuit(t);
					break;
				case 'arch':
					drawArch(t);
					break;
				case 'radar':
					drawRadar(t);
					break;
			}

			animationId = requestAnimationFrame(draw);
		}

		draw();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<canvas bind:this={canvas} width="136" height="136" class="w-[68px] h-[68px]"></canvas>
