<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let dateValue = $state('--/--/----');
	let timeValue = $state('--:--:--');
	let isVisible = $state(false);

	// Animation frame IDs for cleanup
	let morphAnimId: number;
	let barcodeAnimId: number;

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

		// Set visible after mount
		setTimeout(() => {
			isVisible = true;
		}, 100);

		// Initialize 3D morph canvas
		initMorphCanvas();

		// Initialize barcode canvas
		initBarcodeCanvas();

		return () => {
			clearInterval(interval);
			cancelAnimationFrame(morphAnimId);
			cancelAnimationFrame(barcodeAnimId);
		};
	});

	function initMorphCanvas() {
		if (!browser) return;
		
		const canvas = document.getElementById('morphCanvas') as HTMLCanvasElement | null;
		if (!canvas) return;
		
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		
		// Extract ctx for closure (TypeScript narrowing)
		const c = ctx;

		const S = 120; // Internal canvas size
		const C = S / 2;
		const FL = 250;

		// Shape definitions
		function icosahedron(r: number) {
			const t = (1 + Math.sqrt(5)) / 2;
			const n = r / Math.sqrt(1 + t * t);
			const rawVerts = [
				[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
				[0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
				[t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
			];
			const v = rawVerts.map((vert) => ({ x: vert[0] * n, y: vert[1] * n, z: vert[2] * n }));
			const e = [
				[0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
				[1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
				[3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
				[4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
				[5, 4], [4, 9], [9, 1], [1, 8], [8, 7],
				[7, 6], [6, 10], [10, 2], [2, 11], [11, 4]
			];
			return { verts: v, edges: e };
		}

		function octahedron(r: number) {
			return {
				verts: [
					{ x: 0, y: r, z: 0 }, { x: 0, y: -r, z: 0 },
					{ x: r, y: 0, z: 0 }, { x: -r, y: 0, z: 0 },
					{ x: 0, y: 0, z: r }, { x: 0, y: 0, z: -r }
				],
				edges: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [4, 3], [3, 5], [5, 2]]
			};
		}

		function cube(r: number) {
			const s = r * 0.7;
			const v: { x: number; y: number; z: number }[] = [];
			for (let x = -1; x <= 1; x += 2) {
				for (let y = -1; y <= 1; y += 2) {
					for (let z = -1; z <= 1; z += 2) {
						v.push({ x: x * s, y: y * s, z: z * s });
					}
				}
			}
			return {
				verts: v,
				edges: [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]]
			};
		}

		function tetrahedron(r: number) {
			return {
				verts: [
					{ x: r, y: r, z: r }, { x: r, y: -r, z: -r },
					{ x: -r, y: r, z: -r }, { x: -r, y: -r, z: r }
				].map(p => ({ x: p.x * 0.7, y: p.y * 0.7, z: p.z * 0.7 })),
				edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
			};
		}

		function dodecahedron(r: number) {
			const phi = (1 + Math.sqrt(5)) / 2;
			const a = r * 0.45;
			const b = a * phi;
			const c = a / phi;
			const rawVerts = [
				[a, a, a], [a, a, -a], [a, -a, a], [a, -a, -a],
				[-a, a, a], [-a, a, -a], [-a, -a, a], [-a, -a, -a],
				[0, c, b], [0, c, -b], [0, -c, b], [0, -c, -b],
				[c, b, 0], [c, -b, 0], [-c, b, 0], [-c, -b, 0],
				[b, 0, c], [b, 0, -c], [-b, 0, c], [-b, 0, -c]
			];
			const v = rawVerts.map((vert) => ({ x: vert[0], y: vert[1], z: vert[2] }));
			const e = [
				[0, 8], [0, 12], [0, 16], [8, 4], [8, 10], [4, 14], [4, 18],
				[12, 1], [12, 14], [1, 9], [1, 17], [14, 5], [5, 9], [5, 19],
				[16, 2], [16, 17], [2, 10], [2, 13], [17, 3], [3, 11], [3, 13],
				[10, 6], [6, 15], [6, 18], [18, 19], [19, 7], [7, 11], [7, 15],
				[9, 11], [15, 13]
			];
			return { verts: v, edges: e };
		}

		const shapeDefs = [
			() => icosahedron(36),
			() => octahedron(38),
			() => cube(36),
			() => tetrahedron(40),
			() => dodecahedron(38)
		];

		const MORPH_DURATION = 3500;
		const MAX_V = 20;
		const MAX_E = 32;

		function pad<T>(a: T[], n: number): T[] {
			const r = [...a];
			while (r.length < n) r.push(a[r.length % a.length]);
			return r.slice(0, n);
		}

		function rotX(v: { x: number; y: number; z: number }, a: number) {
			const c = Math.cos(a), s = Math.sin(a);
			return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
		}

		function rotY(v: { x: number; y: number; z: number }, a: number) {
			const c = Math.cos(a), s = Math.sin(a);
			return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
		}

		function rotZ(v: { x: number; y: number; z: number }, a: number) {
			const c = Math.cos(a), s = Math.sin(a);
			return { x: v.x * c - v.y * s, y: v.x * s + v.y * c, z: v.z };
		}

		function proj(v: { x: number; y: number; z: number }) {
			const s = FL / (FL + v.z);
			return { x: C + v.x * s, y: C + v.y * s, depth: v.z, scale: s };
		}

		function draw() {
			c.clearRect(0, 0, S, S);
			const now = performance.now();
			const t = now * 0.001;
			const ct = now % (MORPH_DURATION * shapeDefs.length);
			const idx = Math.floor(ct / MORPH_DURATION);
			const prog = (ct % MORPH_DURATION) / MORPH_DURATION;
			const ni = (idx + 1) % shapeDefs.length;

			const sA = shapeDefs[idx]();
			const sB = shapeDefs[ni]();

			const vA = pad(sA.verts, MAX_V);
			const vB = pad(sB.verts, MAX_V);
			const eA = pad(sA.edges, MAX_E);
			const eB = pad(sB.edges, MAX_E);

			let bl = 0;
			if (prog > 0.75) {
				bl = (prog - 0.75) / 0.25;
				bl = bl * bl * (3 - 2 * bl);
			}

			const morphed = vA.map((a, i) => ({
				x: a.x + (vB[i].x - a.x) * bl,
				y: a.y + (vB[i].y - a.y) * bl,
				z: a.z + (vB[i].z - a.z) * bl
			}));

			const edges = eA.map((e, i) => bl < 0.5 ? e : eB[i]);

			const rot = morphed.map(v => rotZ(rotY(rotX(v, t * 0.4), t * 0.6), t * 0.2));
			const proj2d = rot.map(v => proj(v));

			edges.forEach(([a, b]) => {
				if (a >= proj2d.length || b >= proj2d.length) return;
				const pa = proj2d[a];
				const pb = proj2d[b];
				const ad = 0.25 + (1 - (rot[a].z + rot[b].z) / 2 / 45 + 0.5) * 0.55;
				c.beginPath();
				c.moveTo(pa.x, pa.y);
				c.lineTo(pb.x, pb.y);
				c.strokeStyle = `rgba(210,218,230,${Math.max(0.08, Math.min(ad, 0.8))})`;
				c.lineWidth = 0.6 + Math.min(ad, 0.8) * 0.4;
				c.stroke();
			});

			proj2d.forEach((p, i) => {
				const ad = 0.3 + (1 - (rot[i].z + 45) / 90) * 0.6;
				const sz = 1 + p.scale * 0.8;
				c.beginPath();
				c.arc(p.x, p.y, sz, 0, Math.PI * 2);
				c.fillStyle = `rgba(220,225,235,${Math.max(0.1, ad)})`;
				c.fill();
				if (ad > 0.5) {
					c.beginPath();
					c.arc(p.x, p.y, sz * 3, 0, Math.PI * 2);
					c.fillStyle = 'rgba(200,210,225,0.04)';
					c.fill();
				}
			});

			c.beginPath();
			c.arc(C, C, 48, 0, Math.PI * 2);
			c.strokeStyle = 'rgba(200,210,225,0.06)';
			c.lineWidth = 0.3;
			c.stroke();

			morphAnimId = requestAnimationFrame(draw);
		}

		morphAnimId = requestAnimationFrame(draw);
	}

	function initBarcodeCanvas() {
		if (!browser) return;
		
		const canvas = document.getElementById('cardBarcodeCanvas') as HTMLCanvasElement | null;
		if (!canvas) return;
		
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		
		// Extract ctx for closure (TypeScript narrowing)
		const c = ctx;

		const W = canvas.width;
		const H = canvas.height;
		const BAR_COUNT = 42;

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

		function draw() {
			c.clearRect(0, 0, W, H);
			const t = performance.now() * 0.001;
			bars.forEach(b => {
				const wave = Math.sin(t * b.speed + b.phase);
				const w = Math.max(0.5, b.baseW + wave * 1.8) * scale;
				const x = b.x * scale;
				const alpha = 0.3 + (wave * 0.5 + 0.5) * 0.35;
				c.fillStyle = `rgba(232,230,227,${alpha})`;
				c.fillRect(x, 0, w, H);
			});
			barcodeAnimId = requestAnimationFrame(draw);
		}

		barcodeAnimId = requestAnimationFrame(draw);
	}
</script>

<div class="hud-card hud-card-bottom" class:visible={isVisible}>
	<div class="hud-grid">
		<div class="cell cell-morph">
			<canvas 
				id="morphCanvas" 
				class="morph-canvas" 
				width="120" 
				height="120"
				aria-label="3D morphing geometric shapes animation"
			></canvas>
			<div class="morph-info">
				<div class="barcode-placeholder">
					<canvas 
						id="cardBarcodeCanvas" 
						class="barcode-canvas"
						width="195" 
						height="36"
						aria-label="Animated barcode visualization"
					></canvas>
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
			<div class="cell-value">C'TAN</div>
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

	.hud-card-bottom.visible {
		transform: translateX(-50%) translateY(0);
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

	.morph-canvas {
		width: 60px;
		height: 60px;
		flex-shrink: 0;
		image-rendering: pixelated;
	}

	.morph-info {
		display: flex;
		flex-direction: column;
	}

	.barcode-placeholder {
		background: rgba(255, 255, 255, 0.02);
		padding: 4px 6px;
	}

	.barcode-canvas {
		display: block;
		height: 36px;
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
